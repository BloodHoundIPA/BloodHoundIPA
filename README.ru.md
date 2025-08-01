<p align="center">
  <img src="./src/img/logo_bloodhoundipa.png" alt="BloodHoundIPA" width="100%" />
</p>

# BloodHoundIPA

Этот README доступен также на [English](./README.md)

Расширение BloodHound для визуализации привилегий и отношений в инфраструктурах на базе FreeIPA.

# Начало работы с BloodHoundIPA

Для понимания базовых принципов работы интерфейса и анализа графа ознакомьтесь с [официальной документацией BloodHound (на англ.)](https://bloodhound.readthedocs.io/en/latest/index.html)

# О проекте

BloodHoundIPA — это форк оригинального проекта [BloodHound](https://github.com/BloodHoundAD/BloodHound).  
Он полностью сохраняет поддержку Active Directory и Azure, но при этом добавляет полноценную совместимость с FreeIPA.

Цель проекта — предоставить те же мощные возможности графового анализа прав и зависимостей для FreeIPA,  
включая поддержку Sudo, HBAC, ролей и других сущностей FreeIPA. Red Team может использовать BloodHoundIPA для поиска сложных цепочек эскалации привилегий и lateral movement. Blue Team — для аудита и укрепления RBAC-модели FreeIPA, sudo-правил и HBAC-политик.

## Что нового в BloodHoundIPA

### Типы вершин

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

### Типы рёбер

- `IPAMemberOf`
- `IPAMemberManager`
- `IPASudoRuleTo`
- `IPAHBACRuleTo`

# Коллекторы

- [BloodyIPA](https://github.com/BloodHoundIPA/BloodyIPA)

# Бинарные сборки

Предсобранные релизы появятся в разделе [Releases](https://github.com/BloodHoundIPA/BloodHoundIPA/releases) позже.

# Генерация тестовых данных

Для создания примерной инфраструктуры FreeIPA используйте [BadBlood](https://github.com/Levatein/BadIPA).

# Благодарности

Огромное спасибо авторам оригинального проекта BloodHound — [@_wald0](https://www.twitter.com/_wald0), [@CptJesus](https://twitter.com/CptJesus) и [@harmj0y](https://twitter.com/harmj0y) — за фундаментальную работу по визуализации привилегий в Active Directory.

Адаптацию под FreeIPA и дальнейшую разработку выполнили:

- [@DrieVlad](https://github.com/DrieVlad)
- [@levatein](https://github.com/levatein)
- [@Name-users](https://github.com/Name-users)

# Лицензия

BloodHoundIPA распространяется на условиях лицензии [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html),  
унаследованной от оригинального проекта [BloodHound](https://github.com/BloodHoundAD/BloodHound) от Specter Ops.  
Полный текст лицензии — в файле [LICENSE](./LICENSE).

