# App Configuration + Key Vault

Node.js based tool for generating Kubernetes Secret Configurations from Azure App Configuration and Azure Key Vault data.

Compatible with environments that use environment variables (eg. Node.js).

### Services used:
- Azure App Configuration
- Azure Key Vault _(optional)_
- Azure Event Grid _(optional)_

## Usage

There are two ways to use this library, either by using the CLI tool or programmatically.

### CLI

```bash
$ azure-k8s-config <input-dir> <output-dir>
```

### Node.js script
```js
const generateSecrets = require('azure-k8s-config');

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

Create Key Vault Resource: *(optional)*

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

# optional
AZURE_KEYVAULT_NAME="<key-vault-resource-name>"
```

If you're using Key Vault, you need to add Key Vault permissions for the Service Principal account

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

### Event Grid *(optional)*

This step is optional but highly recommended for keeping Azure App Configuration values synced with the deployed Kubernetes Secrets. 

Azure Event Grid can be used to listen to changes in your App Configuration, and trigger events based on that, eg. a webhook to trigger your Continuous Deployment (CD) tool.

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


## License

MIT 2020 - Jim Saari
