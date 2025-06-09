# GCP Compute Services Overview

A quick reference to pick, configure and manage compute in GCP.

---

## 1. Compute Service Selection
Match your workload to the right compute model:

| Service               | Type               | Best for…                                  |
|-----------------------|--------------------|--------------------------------------------|
| **Compute Engine**    | IaaS (VMs)         | Full-control VMs, lift-and-shift, legacy    |
| **Cloud Run**         | Serverless CI/CD   | Containerized services, autoscaling         |
| **Cloud Functions**   | FaaS               | Event-driven code, pay-per-invoke           |
| **GCP Marketplace**   | Managed solutions  | One-click stacks (e.g. WordPress, ELK)      |

---

## 2. Google Compute Engine (GCE)
- **Instances**: Predefined/custom machine types, boot disks  
- **Networking**: VPC, subnets, external/internal IPs, firewall rules  
- **Storage**: Persistent disks (standard/SSD), snapshots, custom images  

## 3. Configuring GCE

* **Instance Templates** → reusable specs
* **Managed Instance Groups (MIGs)** → autoscaling & healing
* **Startup Scripts & Metadata** → automated init tasks
* **IAM & Service Accounts** → scoped VM permissions

---

## 4. GCE Resources

* **Disks**: attach/detach, resize on-the-fly
* **Snapshots & Images**: backups & custom VM images
* **Machine Images**: capture full VM state

---

## 5. GCP Marketplace (WordPress)

1. Open **Marketplace** → select **WordPress**
2. Click **Deploy**, choose zone/instance size & network
3. Review pricing & launch

> Pre-configured LAMP stack, auto-patching & easy upgrades.

---

## 6. Google Cloud Functions

* **Model**: Serverless functions, auto-scale to zero
* **Triggers**: HTTP, Pub/Sub, Storage, Firestore, etc.
* **Runtimes**: Node.js, Python, Go, Java, .NET

```bash
gcloud functions deploy helloWorld \
  --runtime python310 \
  --trigger-http \
  --region us-central1
```

---

## 7. Google Cloud Run

* **Model**: Baked Images, Fully managed containers, request-driven scaling
* **Features**: Custom domains, concurrency limits, VPC egress

```bash
gcloud run deploy api-service \
  --image gcr.io/my-project/api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

----

# Quick-reference for monitoring, scheduling and dev‐ops in GCP.

---

## 1. Tool Selection Criteria
Choose based on need:

| Tool                           | Category         | Use Case                                   |
|--------------------------------|------------------|--------------------------------------------|
| **Cloud Logging**              | Monitoring       | Centralized log collection & analysis      |
| **Cloud Scheduler**            | Orchestration    | Cron-style task scheduling                 |
| **Cloud Code for VS Code**     | IDE Integration  | In-editor GCP resource scaffolding & debug |

---

## 2. Cloud Logging
- **Unified logs** from VMs, containers, APIs, functions  
- **Agents**:  
  - VM: install Ops Agent (`google-cloud-ops-agent`)  
  - Kubernetes: Stackdriver Logging sidecar  
- **Analysis**: filters, metrics, export to BigQuery/Pub-Sub/Cloud Storage  

```bash
# View recent error logs for Compute Engine VMs
gcloud logging read \
  'resource.type="gce_instance" severity>=ERROR' \
  --limit=50 --format="table(timestamp, textPayload)"
````

---

## 3. Cloud Scheduler

* **Cron jobs** as managed service (daily, hourly, minutely)
* **Targets**: HTTP(S) endpoints, Pub/Sub topics, App Engine
* **Retry & Auth**: built-in OAuth, custom headers

```bash
# Create a daily Pub/Sub trigger at 8 AM UTC
gcloud scheduler jobs create pubsub daily-job \
  --schedule="0 8 * * *" \
  --topic=my-topic \
  --message-body='{"action":"cleanup"}'
```

---

## 4. Cloud Code for VS Code (Compute Engine)

* **Scaffold instances** & startup scripts via GUI
* **Remote debugging**: SSH-tunnelled breakpoints
* **Built-in snippets**: `gcloud compute…` commands, Terraform

1. Install **Cloud Code** extension
2. Open **Command Palette** → `Cloud Code: New Compute Engine VM`
3. Fill in machine type, image, network

---

## 5. Cloud Code for VS Code (Cloud Run)

* **Local iteration**: build & debug containers locally
* **Deploy** directly from editor with config preview
* **YAML validation** & manifest auto-completion

1. `Cloud Code: New Application` → select Cloud Run
2. Edit `cloudbuild.yaml` or `Dockerfile`
3. Use **Run & Debug** to launch in emulator or remote

---

## 6. Data Evaluation

### Service Selection

| Service               | Type                     | Best for…                                |
|-----------------------|--------------------------|------------------------------------------|
| **Dataprep**          | Serverless data cleaning (apache beam); for prep | Interactive wrangling & schema inference |
| **Data Fusion**       | Managed ETL (CDAP-based) (apache spark); for injection | Drag-drop pipelines (batch & streaming)  |
| **BigQuery (UI)**     | Ad hoc SQL & viz         | Quick charts, dashboards, BI export      |
| **BigQuery ML**       | In-warehouse ML using SQL query          | Fast prototyping (linear, k-means, etc.) |

### Key Features

- **Dataprep**
  - Auto-suggest transforms, detect anomalies
  - One-click job runs → GCS or BigQuery outputs
- **Data Fusion**
  - Prebuilt connectors: GCS, BigQuery, Pub/Sub, Kafka
  - Reusable pipeline templates, error-handling
- **BigQuery ad hoc visualizations**
  - Built-in charting & map visualizations
  - Export results to Data Studio, Sheets
  - Has marketplace
- **BigQuery ML**
  - SQL-first model creation:
    ```sql
    CREATE MODEL mydataset.logreg_model
      OPTIONS(model_type='logistic_reg') AS
    SELECT * FROM mydataset.training_table;
    ```
  - Supports regression, classification, clustering

---

## 7. Machine Learning

Export Model using python pickle library

### Model Management & MLOps

- **Vertex AI**
  - End-to-end: datasets → training → hyperparameter tuning → deployment
  - Pipelines (Kubeflow SDK) & Feature Store

- **Kubeflow on GKE**
  - Portable pipelines, custom operators

### Notebooks

| Notebook                     | Characteristics                                |
|------------------------------|------------------------------------------------|
| **Colab**                    | Free GPU/TPU, easy sharing & collaboration     |
| **Vertex AI Managed Notebooks**   | Auto-scaling, built-in GCP integrations, Uses Jupiter (multiple kernel like pySpark, PyTorch, TerserFlow ...)     |
| **Vertex AI User-Managed Notebooks** | Full control (GCE/GKE), custom libraries, can be scheduled |

### Vision & AutoML APIs

- **Cloud Vision API**
  - Label detection, OCR, face/object detection, Color Palate  
  ```bash
  gcloud ml vision detect-labels \
    --image=gs://BUCKET/IMAGE.jpg
    ```

- **AutoML for Text Analysis**

  * Custom classification & entity extraction via UI or CLI; like medical terms

  ```bash
  gcloud automl text classify create \
    --dataset=TEXT_DS_ID \
    --model-display-name="news_classifier"
  ```


