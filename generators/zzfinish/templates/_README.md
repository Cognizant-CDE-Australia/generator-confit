<!--[nameHeading]-->
<%- nameHeading %>

<!--[]-->
<!--[description]-->
<%- description %>

<!--[]-->

##Install

<!--[install]-->
<%- install %>

<!--[]-->

##Development Tasks

<!--[taskDefinition]-->
<%- taskDefinition %>

<!--[]-->

##Changing build-tool configuration

There are 3 ways you can change the project build-tool configuration:

1. BEST: Modify the Confit configuration file (usually **confit.json**) by hand, then re-run `yo confit` and tell it to use the existing configuration.
1. OK: Re-run `yo confit` and provide new answers to the questions. **Confit will attempt to overwrite your existing configuration, so make sure you have committed your code to a SCCS (e.g. git) first**.
  There are certain configuration settings which can **only** be specified by hand, in which case the first option needs to be used.
1. RISKY: Modify the generated build-tool config by hand. Be aware that if you re-run `yo confit` it will attempt to overwrite your changes. So commit your changes to source control first.


Additionally, the **currently generated** configuration can be extended in the following ways:

- The task configuration is defined in [package.json](package.json). It is possible to change the task definitions to add your own sub-tasks.
<!--[extensionPoints]-->
<%- extensionPoints %>

<!--[]-->
