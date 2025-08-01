<p align="center">
  <img src="./src/img/logo_bloodhoundipa.png" alt="BloodHoundIPA" width="100%" />
</p>

# BloodHoundIPA

This README is also available in: [Русском](./README.ru.md)

Extension of BloodHound to visualize privilege relationships in FreeIPA environments.

# Getting Started with BloodHoundIPA

To get started with BloodHound, check out the [original BloodHound docs.](https://bloodhound.readthedocs.io/en/latest/index.html)

# About BloodHoundIPA

BloodHoundIPA is a fork of the original [BloodHound](https://github.com/BloodHoundAD/BloodHound) project.  
It retains full functionality for Active Directory and Azure environments, while adding native support for FreeIPA.

The goal is to bring the same powerful graph-based privilege analysis to FreeIPA-based infrastructures,  
including support for Sudo, HBAC, Roles, and custom FreeIPA entities.

BloodHoundIPA uses graph theory to reveal hidden and often unintended privilege relationships  
within FreeIPA, Active Directory, or Azure environments.

Red Teams can use BloodHoundIPA to identify complex attack paths across nested delegation models.  
Blue Teams can use it to map and harden FreeIPA RBAC, Sudo chains, and access control rules.  
It empowers both offensive and defensive teams to gain deeper insight into identity relationships in hybrid infrastructures.

## What's new in BloodHoundIPA

### Node Types

- `IPABase`
- `IPAService`
- `IPAUserGroup`
- `IPAUser`
- `IPAHost`
- `IPAHostGroup`
- `IPANetGroup`
- `IPASudo`
- `IPASudoGroup`
- `IPASudoRule`
- `IPARole`
- `IPAPrivilege`
- `IPAPermission`
- `IPAHBACRule`
- `IPAHBACService`
- `IPAHBACServiceGroup`


### Edge Types

- `IPAMemberOf`
- `IPAMemberManager`
- `IPASudoRuleTo`
- `IPAHBACRuleTo`

# Collectors

- [BloodyIPA](https://github.com/BloodHoundIPA/BloodyIPA)

# Downloading BloodHoundIPA Binaries

Prebuilt binaries will be published in the [Releases](https://github.com/BloodHoundIPA/BloodHoundIPA/releases) section soon.

# Creating example data

You can create your own example FreeIPA environment using [BadBlood](https://github.com/Levatein/BadIPA).

# Credits

Huge thanks to the original creators of BloodHound — [@_wald0](https://www.twitter.com/_wald0), [@CptJesus](https://twitter.com/CptJesus) and [@harmj0y](https://twitter.com/harmj0y) — for laying the foundation for privilege graphing in Active Directory.

FreeIPA adaptation and development by:

- [@DrieVlad](https://github.com/DrieVlad)
- [@levatein](https://github.com/levatein)
- [@Name-users](https://github.com/Name-users)


# License

BloodHoundIPA is distributed under the [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) license,  
inherited from the original [BloodHound](https://github.com/BloodHoundAD/BloodHound) project by Specter Ops.  
See the full license text in the [LICENSE](./LICENSE) file.

