import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherNoNumberLink from './Components/NodeCypherNoNumberLink';
import MappedNodeProps from './Components/MappedNodeProps';
import ExtraNodeProps from './Components/ExtraNodeProps';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import { withAlert } from 'react-alert';
import { Table } from 'react-bootstrap';
import styles from './NodeData.module.css';
import { useContext } from 'react';
import { AppContext } from '../../../AppContext';

const IPAUserNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectId, setObjectId] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState(null);
    const [nodeProps, setNodeProps] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, blocksinheritance, domain) => {
        if (type === 'IPAUser') {
            setVisible(true);
            setObjectId(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAUser {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    session.close();
                });
        } else {
            setObjectId(null);
            setVisible(false);
        }
    };

    const displayMap = {
        displayname: 'Display Name',
        objectid: 'Object ID',
        email: 'Email',
        homedirectory: 'Home Directory',
        userpassword: 'User Password',
        owned: 'Compromised',
        
        cn: "CN",
        dn: 'DN',
        gecos: 'GECOS',
        gidnumber: 'GID Number',
        givenname: 'Given Name',
        highvalue: 'High Value',
        initials: 'Initials',
        ipauniqueid: 'IPA Unique ID',
        krbcanonicalname: 'Kerberos Canonical Name',
        krblastpwdchange: 'Kerberos Last Password Change',
        krbpasswordexpiration: 'Kerberos Password Expiration',
        krbprincipalname: 'Kerberos Principal Name',
        krblastadminunlock: 'Kerberos Last Admin Unlock',
        krblastfailedauth: 'Kerberos Failed Authentication',
        krbloginfailedcount: 'Kerberos Login Failed Count',
        loginshell: 'Login Shell',
        mail: 'Email',
        memberof_group: 'Memberof Group',
        memberof_netgroup: 'Memberof Netgroup',
        memberof_role: 'Memberof Role',
        memberof_sudorule: 'Memberof Sudorule',
        name: 'Name',
        objectclass: 'Object Class',
        preserved: 'Preserved',
        sn: 'Second Name',
        uid: 'UID',
        uidnumber: 'UID Number',
        nsaccountlock: 'NS Account Lock'
        
    };

    return objectId === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectId}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Reachable High Value Targets'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (m:IPAUser {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NOT m=n'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='User Groups'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPAUserGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Net Groups'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPANetGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Roles'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPARole)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Permissions'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPAPermission)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='HBAC rules'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPAHBACRule)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Sudo rules'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n:IPASudoRule)'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <CollapsibleSection header={'GROUP MEMBERSHIP'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Group Memberships'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(m:IPAUser {objectid: $objectid})-[:IPAMemberOf]->(n) WHERE n:IPAUserGroup OR n:IPANetGroup'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Unrolled Group Membership'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p = (m:IPAUser {objectid: $objectid})-[r:IPAMemberOf*1..]->(n) WHERE n:IPAUserGroup OR n:IPANetGroup'
                                    }
                                    start={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'OUTBOUND OBJECT CONTROL'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Object Control'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(u:IPAUser {objectid: $objectid})-[r1]->(n) WHERE r1.isacl=true'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Group Delegated Object Control'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(u:IPAUser {objectid: $objectid})-[:IPAMemberOf*1..]->(g)-[r2]->(n) WHERE (g:IPAUserGroup OR g:IPANetGroup) AND r2.isacl=true'
                                    }
                                    start={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Control'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid MATCH p=shortestPath((u:IPAUser {objectid: $objectid})-[r1:IPAMemberOf|IPAMemberManager|IPASudoRuleTo|IPAHBACRuleTo*1..]->(n))'
                                    }
                                    start={label}
                                    distinct
                                />

                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'INBOUND CONTROL RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Explicit Object Controllers'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(n)-[r]->(u1:IPAUser {objectid: $objectid}) WHERE r.isacl=true'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Object Controllers'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(n)-[r:IPAMemberOf*1..]->(g:IPAUserGroup)-[r1:IPAMemberOf|IPAMemberManager|IPASudoRuleTo|IPAHBACRuleTo]->(u:IPAUser {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = u.objectid) AND NOT n.objectid = u.objectid'
                                    }
                                    end={label}
                                    distinct
                                />
                                <NodePlayCypherLink
                                    property='Transitive Object Controllers'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH (n) WHERE NOT n.objectid=$objectid MATCH p = shortestPath((n)-[r1:IPAMemberOf|IPAMemberManager|IPASudoRuleTo|IPAHBACRuleTo*1..]->(u1:IPAUser {objectid: $objectid}))'
                                    }
                                    end={label}
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>


                {/* <Notes objectid={objectId} type={'IPAUser'} />
                <NodeGallery
                    objectid={objectId}
                    type={'IPAUser'}
                    visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAUserNodeData.propTypes = {};
export default withAlert()(IPAUserNodeData);
