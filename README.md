# App Configuration + Key Vault

Node.js based tool for generating Kubernetes Secret Configurations from Azure App Configuration and Key Vault entries. Compatible with enviroments that use environment variables (eg. Node.js).

### Services used:
- Azure App Configuration
- Azure Key Vault _(optional)_
- Azure Event Grid _(optional)_

## Usage

There are two ways to use this library, either programmatically or using the CLI tool.

### CLI

```bash
$ azure-app-config-k8s <input-dir> <output-dir>
```

### Programmatically
```js
const generateSecrets = require('azure-app-config-k8s-secret');

generateSecrets({
	input: '<input-dir>',
	output: '<output-dir>'	
});
```

## Setup Azure

### Create Service Principal

Create App Configuration Resource:

```bash
az appconfig create --name <app-configuration-resource-name> \
	--resource-group <resource-group-name> \
	--location eastus
```

Create Key Vault Resource:

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

Next create your .env file.

Your `.env` file should look like this:

```
AZURE_KEYVAULT_NAME="<key-vault-resource-name>"
AZURE_APP_CONFIG_NAME="<app-configuration-resource-name>"
AZURE_TENANT_ID="<tenant>"
AZURE_CLIENT_ID="<appId>"
AZURE_CLIENT_SECRET="<password>"
```

Set Azure Key Vault permissions for the Service Principal

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
