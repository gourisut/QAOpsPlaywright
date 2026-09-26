// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config=({
  //specify which test to execute 
  testDir: './tests',
  retries: 1 ,//failed test will retry failed test case one more time 
  //workers:2, // at max 2 files will executes parallaly 

  //timeout duration
  timeout: 40 *1000,
  expect: {
    timeout: 5000,
  },

  reporter:'html',

  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */

    //Specify browser details chromium for chrome, webkit for firefox, msedge for edge
    browserName : "chromium",
   
    //True / false to see broweser invoking
    headless: false,

    //if want screen shot of every step of automation
    screenshot : 'on',

    //trace log
    trace:'on',

  },



});
//export modele, so it will be across your project
module.exports =config
