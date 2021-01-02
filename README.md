# App Configuration + Key Vault Kubernetes Secrets

Node.js based tool for generating Kubernetes Secret Configurations from Azure App Configuration and Azure Key Vault data.

Compatible with environments that use environment variables (eg. Node.js).

_Note:_ This package creates **opaque** Kubernetes secrets, which are base64 encoded and not securely encrypted.

## Features

- Version control your configurations without commiting sensitive data.
- Kubernetes vendor agnostic.
- Mix App Configuration keys with local variables.
- Written in TypeScript, typings included.

### Services used:

- [Azure App Configuration](https://azure.microsoft.com/en-gb/services/app-configuration/)
- [Azure Key Vault](https://azure.microsoft.com/en-gb/services/key-vault/) _(optional)_
- [Azure Event Grid](https://azure.microsoft.com/en-gb/services/event-grid/) _(optional)_

## How it works

Instead of directly entering the data values in your Secrets, you enter the key of your wanted App Configuration key-value pair. The application then fetches the value associated with the key,
base64 encodes it and returns the ready to use configuration.

### Example

An example secret configuration.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: production
type: Opaque
data:
  JWT_SECRET: backend-service/production/jwt-secret
  BASE_URL: backend-service/production/base-url
```

returns:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
  namespace: production
type: Opaque
data:
  JWT_SECRET: c2llbmkgZWkgb2xlIGthc3Zp
  BASE_URL: aHR0cHM6Ly9leGFtcGxlLmFwcA==
```

## Usage

There are two ways to use this library, either the Command-Line or programmatically in a Node script.

#### Using the Command Line (npx)

```bash
npx azure-k8s-config input/ output/
```

#### Using in a node script

```bash
npm install azure-k8s-config
```

```js
const generateSecrets = require("azure-k8s-config");

generateSecrets({
  input: "<input-dir>",
}).then((configs) => { /* ... */ });
```

## API

```bash
azure-k8s-config <INPUT-DIRECTORY> <OUPUT-DIRECTORY> [FLAGS]
```

### Flags

- `--force` (_alias_ `-f`, _default:_ `false`) – allow usage of locally defined variables not defined in App Configuration.
- `--recursive` (_alias_ `-r`, _default:_ `false`) – Recursively search through subdirectories for kubernetes configurations

## Setting up Azure

This workflow requires you to setup a few Azure resources to get everything working correctly. This package only requires App Configuration and can be used without the Azure Key Vault service.

### Create Service Principal

Create App Configuration Resource:

```bash
az appconfig create --name <app-configuration-resource-name> \
	--resource-group <resource-group-name> \
	--location eastus
```

Create Key Vault Resource: _(optional)_

```bash
az keyvault create --name <key-vault-resource-name> \
	--resource-group <resource-group-name> \
	--location eastus
```

Create Service Principal:

```bash
az ad sp create-for-rbac -n example-app --skip-assignment
```

which outputs:

```json
{
  "appId": "xxxx-xxxx-xxxx",
  "displayName": "example-app",
  "name": "http://example-app",
  "password": "xxxx-xxxx-xxxx",
  "tenant": "xxxx-xxxx-xxxx"
}
```

Next create an .env file in the project root directory.

Your `.env` file should look like this:

```
AZURE_APP_CONFIG_NAME="<app-configuration-resource-name>"
AZURE_TENANT_ID="<tenant>"
AZURE_CLIENT_ID="<appId>"
AZURE_CLIENT_SECRET="<password>"
AZURE_KEYVAULT_NAME="<key-vault-resource-name>" # optional
```

_Note_

Make sure to save your service principal password, as you cannot retrieve it again after this step. If you've lost your password you need to generate a new password using the following command:

```
 az ad sp credential reset --name <service principal's appId>
```

If you're using Key Vault, you also need to add Key Vault permissions for the Service Principal account

```bash
az keyvault set-policy --name <key-vault-resource-name> \
	--spn <appId> \
	--secret-permissions get
```

Add Reader permissions for service principal

```bash
az role assignment create --role "App Configuration Data Reader" \
	--assignee <appId> \
	--resource-group <resource-group-name>
```

### Setting up Azure Event Grid _(optional)_

This step is optional but recommended if you want to keep your Kubernetes Secret configurations synced with Azure App Configuration.

Azure Event Grid can be used to listen to App Configuration changes and trigger events based on that, eg. a webhook to trigger your Continuous Deployment (CD) tool.

Register Azure Event Grid if you haven't already

```bash
az provider register -n Microsoft.EventGrid
```

The registration might take a while, you can check the status with the following command

```bash
az provider show -n Microsoft.EventGrid --query "registrationState"
```

After the registration is finished you'll be able to create subscriptions to your Event Grid.
The following example subscribes to the App Configuration resource and hits the given endpoint every time a key is added, updated or removed.

```bash
az eventgrid event-subscription create \
  --source-resource-id <app-configuration-resource-name> \
  --name <event-subscription-name> \
  --endpoint <webhook-endpoint>
```

## Development

> Add dev setup instructions

## License

MIT 2021 - Jim Saari
