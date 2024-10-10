# Metagraph Monitoring Service

This repository hosts the Metagraph Monitoring Service. This service uses the metagraph-monitoring-package to monitor your metagraph.

## Dependencies

### NodeJS
* You should have NodeJS > 18 installed
* Check the [installation guide](https://nodejs.org/en/download/package-manager)

### Yarn
* You should have yarn installed
* Check the [installation guide](https://classic.yarnpkg.com/lang/en/docs/install)

### Metagraph Monitor Service Package
* This npm package serves as a base for triggering monitoring. For more details, visit [here](https://github.com/Constellation-Labs/metagraph-monitoring-service-package)  
 
## Installation
After cloning the repository, ensure you fetch all the dependencies. Please make sure you are using Node.js version 18 or higher. To install the dependencies, simply run the following command:

`yarn`  

This will download all the necessary dependencies and populate the `node_modules` folder.

## Configuration

To run this service, you must provide the necessary configuration in the file: `config/config.json`. This file contains the following fields:

*  **`metagraph.id`**: The unique identifier for your metagraph.

*  **`metagraph.name`**: The name of your metagraph.

*  **`metagraph.version`**: The version of your metagraph.

*  **`metagraph.default restart_conditions`**: Specifies the conditions under which your metagraph should restart. These conditions are located in the directory: `src/jobs/restart/conditions`. To add new conditions:

	* Implement the `IRestartCondition` interface.

	* Provide the conditions on MonitoringApp class constructor

	* By default, there are two conditions:

		*  `SnapshotStopped`: Triggers if your metagraph stops producing snapshots.

		*  `UnhealthyNodes`: Triggers if your metagraph nodes become unhealthy.

*  **`metagraph.layers`**: Details about your metagraph layers. Options include:
	
	*  **`ignore_layer`**: Set to `true` to disable a layer such as `currency-l1` or `data-l1`.

	*  **`ports`**: Lists public, p2p, and cli ports.

	*  **`additional_env_variables`**: Additional environment variables needed upon restart. Format: `["TEST=MY_VARIABLE, TEST_2=MY_VARIABLE_2"]`.

	*  **`seedlist`**: Information about the layer seedlist. Example: `{ base_url: ":your_url", file_name: ":your_file_name"}`.

*  **`metagraph.nodes`**: Configuration for your metagraph nodes:
	
	*  **`ip`**: IP address of the node.

	*  **`username`**: Username for SSH access to the node.
	
  *  **`password`**: Password for SSH access to the node. You can remove this field if the node does not require a password for access.

	*  **`privateKeyPath`**: Path to the private key for SSH, relative to the service's root directory. Example: `config/your_key_file.pem`.

	*  **`key_file`**: Details of your `.p12` key file used for node startup, including `name`, `alias`, and `password`.

*  **`network.name`**: The network your metagraph is part of, such as `integrationnet` or `mainnet`.

*  **`network.nodes`**: Information about the GL0s nodes.

*  **`check_healthy_interval_in_minutes`**: The interval, in minutes, at which the health check should run.


## Customizing Services

You can adapt this repository to meet your specific needs. By default, we have predefined services implemented, so you can use the following example:


```
import MonitoringApp from 'constellation-metagraph-monitoring-service';

const monitoring = new MonitoringApp(config);
await monitoring.checkMetagraphHealth();
```

The example above starts the application with default services based on your configuration.

Additionally, you can customize services further by implementing several interfaces such as `IAlertService`, `ILoggerService`, `IGlobalNetworkService`, `IMetagraphService`, `ISeedlistService`, and `ISshService`. All these interfaces are available in the following import statement:

```
import {
  IAlertService,
  ILoggerService,
  IGlobalNetworkService,
  IMetagraphService,
  ISeedlistService,
  ISshService,
} from '@constellation/metagraph-monitoring-service/interfaces';
``` 

Detailed explanations for each interface can be found on the [Monitoring Service Package](https://github.com/Constellation-Labs/metagraph-monitoring-service-package).

Once you implement your services, provide them to the constructor as shown below:
```
import MonitoringApp from '@constellation/metagraph-monitoring-service';
import { IAlertService } from '@constellation/metagraph-monitoring-service/interfaces';

class MyCustomAlert implements IAlertService {
  logger: ILoggerService;
  config: MonitoringConfigs;
  createRestartStarted(restartType: string, restartReason: string): Promise<void>;
  createRestartFailed(failedReason: string): Promise<void>;
  closeAlert(alertType: AlertType): Promise<void>;
}

const myCustomAlert = new MyCustomAlert();
const monitoring = new MonitoringApp(
  config,
  options.force_restart,
  options.dev_mode,
  {
    alertService: myCustomAlert,
  },
);
```
## Customizing Restart Conditions

You can also customize your restart conditions. Import and implement a custom restart interface as follows:
```
import { IRestartCondition } from '@constellation/metagraph-monitoring-service/interfaces';

class MyCustomRestartCondition implements IRestartCondition {
}

const monitoring = new MonitoringApp(
    ...,
    ...,
    ...,
);

monitoring.configuration.setRestartConditions([
  new MyCustomRestartCondition(monitoring.configuration),
]);

```

## Running the service
This service can be executed in several modes using Yarn commands, each designed for specific use cases:
-   **`yarn start`**: Starts the application in the background using `pm2`, which keeps the service running.
-   **`yarn kill`**: Terminates the service started with `yarn start`.
-   **`yarn dev`**: Launches the application in the background with logs displayed in the current terminal.
-   **`yarn kill-dev`**: Terminates the service started with `yarn dev`.
-   **`yarn force-restart`**: Similar to `yarn start`, but with a forced restart. This action completely restarts your metagraph on the first iteration of the task.
-   **`yarn force-restart-dev`**: Combines the features of `yarn force-restart` and `yarn dev`. It forces a restart of the metagraph and displays logs in the console, keeping the process attached to the current terminal.
-   **`yarn list-services`**: Lists all active services.