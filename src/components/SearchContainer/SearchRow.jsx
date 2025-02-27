import React from 'react';
import { Highlighter } from 'react-bootstrap-typeahead';
import styles from './SearchRow.module.css';
import clsx from 'clsx';

const SearchRow = ({ item, search }) => {
    let searched;
    if (search.includes(':')) {
        searched = search.split(':')[1];
    } else {
        searched = search;
    }

    let type = item.type;
    let icon = {};

    const selectName = () => {
        if (item.hasOwnProperty("name")){
            return item["name"];
        }else if (item.hasOwnProperty("azname")){
            return item["azname"];
        }else{
            return item["objectid"]
        }
    }

    switch (type) {
        case 'Group':
            icon.className = 'fa fa-users';
            break;
        case 'User':
            icon.className = 'fa fa-user';
            break;
        case 'Computer':
            icon.className = 'fa fa-desktop';
            break;
        case 'Domain':
            icon.className = 'fa fa-globe';
            break;
        case 'GPO':
            icon.className = 'fa fa-list';
            break;
        case 'OU':
            icon.className = 'fa fa-sitemap';
            break;
        case 'Container':
            icon.className = 'fa fa-box'
            break
        case 'IPAUser':
            icon.className = 'fa fa-user';
            break;
        case 'IPAHost':
            icon.className = 'fa fa-desktop';
            break;
        case 'IPAUserGroup':
            icon.className = 'fa fa-users';
            break;
        case 'IPAHostGroup':
            icon.className = 'fa fa-server';
            break;
        case 'IPANetGroup':
            icon.className = 'fa fa-network-wired';
            break;
        case 'IPASudo':
            icon.className = 'fa fa-terminal';
            break;
        case 'IPASudoGroup':
            icon.className = 'fa fa-list';
            break;
        case 'IPASudoRule':
            icon.className = 'fa fa-book';
            break;
        case 'IPAHBACRule':
            icon.className = 'fa fa-list-check';
        case 'IPAHBACService':
            icon.className = 'fa fa-check';
        case 'IPAHBACServiceGroup':
            icon.className = 'fa fa-check-double';
        case 'IPARole':
            icon.className = 'fa fa-address-book';
            break;
        case 'IPAPrivilege':
            icon.className = 'fa fa-arrow-up-from-bracket';
            break;
        case 'IPAPermission':
            icon.className = 'fa fa-arrow-up';
            break;
        case 'IPAService':
            icon.className = 'fa fa-gear';
            break;
        case 'AZUser':
            icon.className = 'fa fa-user';
            break;
        case 'AZGroup':
            icon.className = 'fa fa-users';
            break;
        case 'AZTenant':
            icon.className = 'fa fa-cloud';
            break;
        case 'AZSubscription':
            icon.className = 'fa fa-key';
            break;
        case 'AZResourceGroup':
            icon.className = 'fa fa-cube';
            break;
        case 'AZManagementGroup':
            icon.className = 'fa fa-cube';
            break;
        case 'AZVM':
            icon.className = 'fa fa-desktop';
            break;
        case 'AZDevice':
            icon.className = 'fa fa-desktop';
            break;
        case 'AZContainerRegistry':
            icon.className = 'fa fa-box-open';
            break;
        case 'AZAutomationAccount':
            icon.className = 'fa fa-cogs';
            break;
        case 'AZLogicApp':
            icon.className = 'fa fa-sitemap';
            break;
        case 'AZFunctionApp':
            icon.className = 'fa fa-bolt-lightning';
            break;
        case 'AZWebApp':
            icon.className = 'fa fa-object-group';
            break;
        case 'AZManagedCluster':
            icon.className = 'fa fa-cubes';
            break;
        case 'AZVMScaleSet':
            icon.className = 'fa fa-server';
            break;
        case 'AZKeyVault':
            icon.className = 'fa fa-lock';
            break;
        case 'AZApp':
            icon.className = 'fa fa-window-restore';
            break;
        case 'AZServicePrincipal':
            icon.className = 'fa fa-robot';
            break;
        case 'AZRole':
            icon.className = 'fa fa-window-restore'
            break
        default:
            icon.className = 'fa fa-question';
            type = 'Base';
            break;
    }

    icon.style = { color: appStore.highResPalette.iconScheme[type].color };
    icon.className = clsx(icon.className, styles.spacing);

    let name = item.name || item.objectid;

    return (
        <>
            <span>
                <i {...icon} />
            </span>
            <Highlighter matchElement='strong' search={searched}>
                {selectName()}
            </Highlighter>
        </>
    );
};

SearchRow.propTypes = {};
export default SearchRow;
