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

##Changing project configuration

There are 3 ways you can change the project configuration:
1. BEST: Modify **confit.json** by hand, then re-run `yo confit` and tell it to use the existing configuration
1. BETTER: Re-run `yo confit` and provide new answers to the questions. **Confit will attempt to overwrite your existing configuration, so make sure you have committed your code to a SCCS (e.g. git) first.**
1. OK: Modify the project config by hand. Be aware that if you re-run `yo confit` it will attempt to overwrite your changes. So commit your changes to source control first.


Additionally, the **currently generated** configuration can be extended in the following ways:

- The task configuration is defined in [package.json](package.json). It is possible to change the task definitions to add your own sub-tasks.
<!--[extensionPoints]-->
<%- extensionPoints %>

<!--[]-->
