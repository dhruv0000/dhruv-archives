# Learning Kubernetes – Quick-Start Cheat Sheet

_Build, deploy & manage containerized apps with Kubernetes (Minikube)_

---

## 1. Kubernetes & the Cloud-Native Ecosystem
- **Kubernetes**: orchestrates containers across clusters (Pods, Services, Deployments).  
- **Containers**: immutable images + runtime (e.g. Docker).  
- **Cloud-native**: microservices + containers + declarative infra.  
- **CNCF**: hosts CNCF-graduated projects (Prometheus, Envoy, Helm).

---

## 2. Setup & “Hello, Cluster!”
1. **Install Docker** (Win / Linux / macOS)  
2. **Install Minikube**  
   ```bash
   # Linux example
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   minikube start --driver=docker
   ```

3. **Verify**

   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

---

## 3. Application Deployment

YAML is not markdown (yml/yaml)
yamlchecker.com

* **YAML Mastery**

  ```yaml
  apiVersion: v1
  kind: Namespace
  metadata: { name: demo }
  ```
* **Create a Namespace**
    - To isolate and manage instances

  ```bash
  kubectl apply -f namespace.yaml
  ```
* **Deploy an App**

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata: { name: web-deploy, namespace: demo, labels: {app: info} }
  spec:
    replicas: 2
    selector: { matchLabels: { app: web } }
    template:
      metadata: { labels: { app: web } }
      spec:
        containers:
        - name: web
          image: nginx:latest
  ```

  ```bash
  kubectl apply -f deployment.yaml
  ```
* **Inspect & Troubleshoot**

  ```bash
  kubectl describe pod -n demo web-deploy-xxxxx
  kubectl logs -n demo web-deploy-xxxxx
  ```
* **BusyBox Health-Check**

  ```bash
  kubectl run -n demo busybox --rm -it --image=busybox -- sh
  # inside: wget -qO- http://web-deploy.demo.svc.cluster.local
  ```

---

## 4. Complex Deployment & Services

* **LoadBalancer Service**

  ```yaml
  apiVersion: v1
  kind: Service
  metadata: { name: web-lb, namespace: demo }
  spec:
    type: LoadBalancer
    selector: { app: web (to direct traffic) }
    ports: [ { port: 80, targetPort: 80 } ]
  ```
* **Resource Requests & Limits**
    - Min and max
  ```yaml
        resources:
          requests: { cpu: "100m", memory: "128Mi" }
          limits:   { cpu: "500m", memory: "512Mi" }
  ```
* **Cleanup**

  ```bash
  kubectl delete namespace demo
  minikube delete
  ```

---

## 5. Kubernetes Architecture

* **Control Plane**

  * *kube-apiserver*: REST endpoint (can be accesseed with kubectl, kubeadm)
  * *etcd*: cluster state store (key-value store)
  * *kube-scheduler*: assigns pods to nodes
  * *kube-controller-manager*: maintains desired state
  * *cloud-controller-manager*: cloud provider integration

* **Worker Nodes**

  * *kubelet*: node agent
  * *kube-proxy*: service networking
  * container runtime (Docker/CRI-O/Containerd)

---

## 6. Advanced Topics & Security

* **Pod Management**: strategy (RollingUpdate, Recreate), probes (liveness/readiness).
    Deployment: Auto-maintain
    Jobs: Run till completion
    DamonSet: In each pod/ background processes, to collet metrics etc..

* **Stateful Workloads**: StatefulSets, PVCs, Headless Services.
 - K8S Persistent Volumes for Data Storage  / Or independent and connect

* **Security Best Practices**
    - Add securityContext: (NonRoot, allowPriveageS)
        ```
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          capabilities:
            drop:
              - ALL
          readOnlyRootFilesystem: true
        ports:
        ```
    - SYNK: Check for security vuln in yaml files

    - K8S hardening with 

  * Enable RBAC & ServiceAccounts
  * Use NetworkPolicies to restrict traffic
  * Scan images & run non-root users
  * Secrets via `kubectl create secret` or external vaults

---

## Next Steps

* Explore Helm charts for templating
* Try multi-node clusters with Kind or managed cloud offerings
* Dive into Ingress, CSI drivers, and operators

