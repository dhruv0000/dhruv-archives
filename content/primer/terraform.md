---
title: "Terraform"
date: 2025-06-09T12:14:44-04:00
# _build:
#   list: local
---

# Architecture Overview

Terraform’s architecture breaks down into several components:

* **CLI & Core Engine:**
  The `terraform` CLI reads HCL/JSON configs, invokes the Core engine to parse and plan changes, and orchestrates CRUD operations via providers’ APIs ([HashiCorp Developer](https://developer.hashicorp.com/terraform/intro?utm_source=chatgpt.com))

* **Providers:**
  Plugins that translate resource declarations into API calls for platforms (AWS, Azure, GCP, Kubernetes, etc.) ([Wikipedia](https://en.wikipedia.org/wiki/Terraform_%28software%29?utm_source=chatgpt.com)). Each provider exports *resources* and *data sources*.

* **Modules:**
  Self-contained packages of resources, inputs, and outputs that promote reuse and encapsulation. Modules can be local, registry-hosted, or remote git sources ([Wikipedia](https://en.wikipedia.org/wiki/Terraform_%28software%29?utm_source=chatgpt.com)).

* **Provisioners (optional):**
  Imperative blocks that execute local or remote scripts at specific lifecycle moments:

  * `remote-exec` — SSH into a resource and run commands.
  * `local-exec` — Run commands on the machine where Terraform runs.
  * `file` — Upload files to a resource.

  **When to use:**

  * Bootstrapping a machine (installing packages).
  * Handling tasks not covered by providers (e.g., config management).

  **Drawbacks:**

  * Breaks declarative purity: Terraform cannot predict or roll back these actions safely.
  * Can cause non-idempotent behavior if scripts change state unpredictably.

**Execution Flow:**

1. `terraform init` – initializes working directory & installs providers
2. `terraform plan` – computes desired vs. current state, generates an execution plan
3. `terraform apply` – applies the plan, updates state
4. `terraform destroy` – removes managed infrastructure

---

## State Management

Terraform uses a **state file** to map real-world resources to your configurations and to optimize large deployments.

### Backends

* **Local (default):**
  Stores state in `terraform.tfstate` on disk; supports file-system locking.

* **Remote backends:**
  Store state in shared systems and support locking. Common types include:

  * **S3 (with DynamoDB locking)**
  * **Consul**
  * **Terraform Cloud/Enterprise**
  * **HTTP**
  * **Vault HTTP** (via third-party backend)

### Backend Configuration

```hcl
terraform {
  backend "remote" {
    organization = "example_org"
    workspaces {
      name = "prod"
    }
  }
}
```

Configure a single `backend` block in the root module; arguments vary per backend type.

---

## Key Terminology Cheat-Sheet

### Core Language Constructs

| Term               | What it means                                                    | Why you care                                            |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------- |
| **Provider**       | Plugin translating HCL to API calls for platforms (AWS, Azure…)  | Determines *where* resources are created and valid args |
| **Resource**       | Block describing an infra object (VM, VPC, DNS record, etc.)     | Adds/changes/deletes real-world objects during apply    |
| **Data Source**    | Read-only block fetching existing info (AMI IDs, IP ranges…)     | Lets you reference infra you didn’t create              |
| **Module**         | Folder of Terraform files for grouping and reuse                 | Keeps code DRY and sharable                             |
| **Input Variable** | Parameterizes modules so callers pass values                     | Makes configs reusable                                  |
| **Output Value**   | Exposes data from a module to CLI or parent modules              | Feeds CI/CD or downstream modules                       |
| **Local Value**    | Named expressions evaluated once and stored in memory            | Avoids repeating long expressions                       |
| **State File**     | JSON mapping declared resources to real IDs and metadata         | Enables drift detection, plan diffs, and imports        |
| **Backend**        | Specifies where state is kept (local, S3, Terraform Cloud, etc.) | Enables collaboration, locking, and durability          |
| **Workspace**      | Named slice of state within one backend (e.g., `dev`, `prod`)    | Manages multiple identical stacks from same config      |

### Meta-Arguments & Helpers

| Meta-Argument        | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `count` / `for_each` | Create many resources from one block         |
| `depends_on`         | Explicitly set build order                   |
| `lifecycle`          | Fine-tune behavior (`create_before_destroy`) |
| `provisioner`        | Imperative steps (`remote-exec`, `file`)     |
| `null_resource`      | Resource with no provider; triggers logic    |
| `sensitive = true`   | Hides values from CLI output & logs          |

### CLI Commands & Workflow

*   **`terraform init`**, **`plan`**, **`apply`**, **`destroy`** – core workflow.

*   **`terraform console`** – interactive console for evaluating expressions.
*   **`terraform fmt`**, **`terraform validate`** – static checks & auto-format HCL code.
*   **`terraform show`** – inspect state or plan files in a human-readable format.
*   **`terraform output`** – read and display output values from the state file.
*   **`terraform graph`** – generate a DOT-formatted dependency graph of resources. (https://magjac.com/graphviz-visual-editor/)
*   **`terraform import <resource_address> <id>`** – bring existing infrastructure under Terraform management.
*   **`terraform state <subcommand>`** (e.g., `list`, `mv`, `rm`, `show`) – advanced state manipulation.
*   **`terraform workspace <subcommand>`** (e.g., `list`, `new`, `select`) – manage named workspaces.
*   **`terraform apply -replace=<resource_address>`** – force replacement of specific resources (replaces the older `terraform taint` command).

### Operations & State Safety

* **State Locking** – prevents concurrent writes (S3 lockfile, DynamoDB, etc.).
* **Drift** – divergence between state and real infra; detected during `plan`.

---

## Built‑in Expressions & Functions

Terraform’s HCL language lets you compute values at **plan/apply time** instead of hard‑coding them. The building blocks are *expressions* (literals, references, operators, and blocks that return data) plus a rich **standard function library**. These evaluate locally during planning, never on remote resources, so they’re fast, deterministic, and side‑effect‑free.

### 1 · Expression Syntax Cheat‑Sheet

| Feature                | Syntax                                         | Use case                          |
| ---------------------- | ---------------------------------------------- | --------------------------------- |
| **References**         | `aws_instance.app[0].public_ip`                | Pull an attr from another block   |
| **String templates**   | `"db endpoint: ${aws_lb.db.dns_name}"`         | Concatenate mixed types           |
| **Arithmetic/Compare** | `var.replicas * 2`, `count.index != 0`         | Maths & booleans                  |
| **Conditional**        | `var.env == "prod" ? 3 : 1`                    | Pick one of two values            |
| **For expressions**    | `[for az in var.azs : "${az}-subnet"]`         | Map/filter/transform lists        |
| **Dynamic blocks**     | `dynamic "ingress" { for_each = var.ports … }` | Generate nested blocks            |
| **Splat operator**     | `aws_instance.app[*].id`                       | Shortcut to collect all instances |

> **Pro tip:** Use `terraform console` to experiment interactively.

### 2 · Standard Function Library

#### a. String Helpers

| Function                    | Example       | Result |
| --------------------------- | ------------- | ------ |
| `lower("HELLO")`            | → `hello`     |        |
| `upper("dev")`              | → `DEV`       |        |
| `trim("?!hello?!","!?")`    | → `hello`     |        |
| `replace("v1.2.3","v","" )` | → `1.2.3`     |        |
| `format("sub-%02d", 7)`     | → `sub-07`    |        |
| `regexall("[a-z]+","a1b2")` | → `["a","b"]` |        |

#### b. Numeric & Math

`abs(-5)` → `5` | `ceil(4.2)` → `5` | `floor(4.9)` → `4` | `max(2,9,4)` → `9`

#### c. Collections (list/map/set)

Functions: `concat`, `flatten`, `length`, `keys`, `values`, plus `setproduct` for Cartesian products.

#### d. IP & CIDR Math

`cidrsubnet("10.0.0.0/16", 8, 5)` → `10.0.5.0/24`; `cidrhost(..., 10)` grabs the 10th host.

#### e. Encoding / Cryptography

`base64encode(file("id_rsa.pub"))`, `sha256(file("binary.tar.gz"))` for checksums or cert delivery.

#### f. Date & Time

`timestamp()` emits an RFC 3339 instant at plan time (UTC).

#### g. Type Conversion & Error–Handling

`tolist(...)`, `tonumber(...)`, `tostring(...)`; `can(expr)` returns false on error; `try(a,b,…)` yields the first non-error.

### 3 · Mini Example

```hcl
locals {
  app_port_map = setproduct(var.apps, var.ports)
  subnet_cidrs = [for i in range(3) : cidrsubnet(var.vpc_cidr, 4, i)]
  release_tag  = format("%s-%s", var.env, timestamp())
}

resource "aws_security_group_rule" "ingress" {
  for_each = { for pair in local.app_port_map :
                 "${pair.app}-${pair.port}" => pair }

  type        = "ingress"
  from_port   = each.value.port
  to_port     = each.value.port
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]

  description = "Allow ${each.value.port} for ${upper(each.value.app)}"
}
```

---

## Advanced Example — Building a Project‑Role Matrix

```hcl
locals {
  # 1. Normalise inputs to sets
  names         = toset(var.names)
  project_roles = toset(var.project_roles)

  # 2. Cartesian product of every name–role combo
  name_role_pairs = setproduct(
    local.names,
    local.project_roles
  )

  # 3. Map-of-objects keyed by "name-role"
  project_roles_map_data = zipmap(
    [for pair in local.name_role_pairs : "${pair[0]}-${pair[1]}"],
    [for pair in local.name_role_pairs : {
       name = pair[0]
       role = pair[1]
    }]
  )
}
```

### Usage in Resources

```hcl
resource "google_project_iam_member" "assignments" {
  for_each = local.project_roles_map_data

  project = var.project_id
  role    = each.value.role
  member  = "user:${each.value.name}@example.com"
}
```

---
