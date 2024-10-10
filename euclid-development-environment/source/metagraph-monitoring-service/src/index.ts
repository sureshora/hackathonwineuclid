import MonitoringApp from '@constellation-network/metagraph-monitoring-service';
import { program } from 'commander';

import config from '@config/config.json';

program
  .version('1.0.0')
  .option('-fr, --force_restart', 'Force complete metagraph restart', false)
  .option('-d, --dev_mode', 'Start application in dev mode', false);

program.parse(process.argv);
const options = program.opts();

async function checkMetagraphHealth() {
  const monitoring = new MonitoringApp(
    config,
    options.force_restart,
    options.dev_mode,
  );

  await monitoring.checkMetagraphHealth();
}

checkMetagraphHealth();
