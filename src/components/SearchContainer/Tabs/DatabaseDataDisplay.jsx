import React, { useContext, useEffect, useState } from 'react';
import styles from './DatabaseDataDisplay.module.css';
import { Table } from 'react-bootstrap';
import DatabaseDataLabel from './Components/DatabaseDataLabel';
import { AppContext } from '../../../AppContext';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';

const DatabaseDataDisplay = () => {
    const [url, setUrl] = useState(appStore.databaseInfo.url);
    const [user, setUser] = useState(appStore.databaseInfo.user);
    const [index, setIndex] = useState(0);
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('refreshDBData', refresh);
        return () => {
            emitter.removeListener('refreshDBData', refresh);
        };
    }, []);

    const refresh = () => {
        setIndex(index + 1);
    };

    const toggleLogoutModal = () => {
        emitter.emit('showLogout');
    };

    const toggleDBWarnModal = () => {
        emitter.emit('openDBWarnModal');
    };

    const toggleSessionClearModal = () => {
        emitter.emit('openSessionClearModal');
    };

    const toggleWarmupModal = () => {
        emitter.emit('openWarmupModal');
    };

    return (
        <div
            className={clsx(
                styles.nodelist,
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <CollapsibleSection header='DB STATS'>
                <Table hover striped responsive>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Address</td>
                            <td align='right'>{url}</td>
                        </tr>
                        <tr>
                            <td>DB User</td>
                            <td align='right'>{user}</td>
                        </tr>
                        <DatabaseDataLabel
                            query={
                                'MATCH ()-[r:HasSession]->() RETURN count(r) AS count'
                            }
                            index={index}
                            label={'Sessions'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH ()-[r]->() RETURN count(r) AS count'}
                            index={index}
                            label={'Relationships'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH ()-[r {isacl: true}]->() RETURN count(r) AS count'
                            }
                            index={index}
                            label={'ACLs'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH ()-[r {isazure: true}]->() RETURN count(r) AS count'
                            }
                            index={index}
                            label={'Azure Relationships'}
                        />
                    </tbody>
                </Table>
            </CollapsibleSection>

            <hr></hr>

            <CollapsibleSection header='ON-PREM OBJECTS'>
                <Table hover striped responsive>
                    <thead></thead>
                    <tbody>
                        <DatabaseDataLabel
                            query={
                                "MATCH (n:User) WHERE NOT n.name ENDS WITH '$' RETURN count(n) AS count"
                            }
                            index={index}
                            label={'Users'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:Group) RETURN count(n) AS count'}
                            index={index}
                            label={'Groups'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:Computer) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'Computers'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:OU) RETURN count(n) AS count'}
                            index={index}
                            label={'OUS'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:GPO) RETURN count(n) AS count'}
                            index={index}
                            label={'GPOs'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:Domain) RETURN count(n) AS count'}
                            index={index}
                            label={'Domains'}
                        />
                    </tbody>
                </Table>
            </CollapsibleSection>

            <hr></hr>

            <CollapsibleSection header='AZURE OBJECTS'>
                <Table hover striped responsive>
                    <thead></thead>
                    <tbody>
                        <DatabaseDataLabel
                            query={'MATCH (n:AZApp)RETURN count(n) AS count'}
                            index={index}
                            label={'AZApp'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZAutomationAccount) RETURN count(n) AS count'}
                            index={index}
                            label={'AZAutomationAccount'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZContainerRegistry) RETURN count(n) AS count'}
                            index={index}
                            label={'AZContainerRegistry'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:AZDevice) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'AZDevice'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZFunctionApp) RETURN count(n) AS count'}
                            index={index}
                            label={'AZFunctionApp'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'AZGroup'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:AZKeyVault) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'AZKeyVault'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZLogicApp) RETURN count(n) AS count'}
                            index={index}
                            label={'AZLogicApp'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZManagedCluster) RETURN count(n) AS count'}
                            index={index}
                            label={'AZManagedCluster'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZManagementGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'AZManagementGroup'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:AZResourceGroup) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'AZResourceGroup'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZRole) RETURN count(n) AS count'}
                            index={index}
                            label={'AZRole'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:AZServicePrincipal) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'AZServicePrincipal'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:AZSubscription) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'AZSubscription'}
                        />
                        <DatabaseDataLabel
                            query={
                                'MATCH (n:AZTenant) RETURN count(n) AS count'
                            }
                            index={index}
                            label={'AZTenant'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZUser) RETURN count(n) AS count'}
                            index={index}
                            label={'AZUser'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZVM) RETURN count(n) AS count'}
                            index={index}
                            label={'AZVM'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZVMScaleSet) RETURN count(n) AS count'}
                            index={index}
                            label={'AZVMScaleSet'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:AZWebApp) RETURN count(n) AS count'}
                            index={index}
                            label={'AZWebApp'}
                        />
                    </tbody>
                </Table>
            </CollapsibleSection>

            <hr></hr>

            <CollapsibleSection header='FreeIPA OBJECTS'>
                <Table hover striped responsive>
                    <thead></thead>
                    <tbody>
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAUser) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAUser'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAHost) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAHost'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAUserGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAUserGroup'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAHostGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAHostGroup'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPANetGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'IPANetGroup'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPASudo) RETURN count(n) AS count'}
                            index={index}
                            label={'IPASudo'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPASudoGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'IPASudoGroup'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPASudoRule) RETURN count(n) AS count'}
                            index={index}
                            label={'IPASudoRule'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAHBACRule) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAHBACRule'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAHBACService) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAHBACService'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAHBACServiceGroup) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAHBACServiceGroup'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPARole) RETURN count(n) AS count'}
                            index={index}
                            label={'IPARole'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAPrivilege) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAPrivilege'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAPermission) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAPermission'}
                        />
                        <DatabaseDataLabel
                            query={'MATCH (n:IPAService) RETURN count(n) AS count'}
                            index={index}
                            label={'IPAService'}
                        />
                    </tbody>
                </Table>
            </CollapsibleSection>

            <hr></hr>

            <div className={clsx('text-center', styles.buttongroup)}>
                <div role='group' className={styles.buttongroup}>
                    <button
                        type='button'
                        className={styles.btnleft}
                        onClick={(x) => {
                            setIndex(index + 1);
                        }}
                    >
                        Refresh Database Stats
                    </button>
                    <button
                        type='button'
                        className={styles.btnright}
                        onClick={toggleWarmupModal}
                    >
                        Warm Up Database
                    </button>
                </div>
                <p></p>
                <div role='group' className={styles.buttongroup}>
                    <button
                        type='button'
                        className={styles.btnleft}
                        onClick={toggleSessionClearModal}
                    >
                        Clear Sessions
                    </button>
                    <button
                        type='button'
                        className={styles.btnright}
                        onClick={toggleDBWarnModal}
                    >
                        Clear Database
                    </button>
                </div>
                <p></p>
                <div className='text-center'>
                    <a href='#' onClick={toggleLogoutModal}>
                        Log Out / Switch Database
                    </a>
                </div>
                <p></p>
            </div>
        </div>
    );
};

DatabaseDataDisplay.propTypes = {};
export default DatabaseDataDisplay;
