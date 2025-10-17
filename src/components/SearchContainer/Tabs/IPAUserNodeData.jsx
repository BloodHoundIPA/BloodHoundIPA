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
        pwdlastset: 'Password Last Changed',
        lastlogon: 'Last Logon',
        lastlogontimestamp: 'Last Logon (Replicated)',
        enabled: 'Enabled',
        email: 'Email',
        title: 'Title',
        homedirectory: 'Home Directory',
        description: 'Description',
        userpassword: 'User Password',
        admincount: 'AdminCount',
        owned: 'Compromised',
        pwdneverexpires: 'Password Never Expires',
        sensitive: 'Cannot Be Delegated',
        dontreqpreauth: 'ASREP Roastable',
        serviceprincipalnames: 'Service Principal Names',
        allowedtodelegate: 'Allowed To Delegate',
        sidhistory: 'SID History',
        
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

                <CollapsibleSection header='MEMBER OF'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
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
                                <NodeCypherLinkComplex
                                    property='HBAC Rules'
                                    target={objectId}
                                    countQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled HBAC Rules'
                                    target={objectId}
                                    countQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule {ipaenabledflag: true}) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule {ipaenabledflag: true}) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Sudo Rules'
                                    target={objectId}
                                    countQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled Sudo Rules'
                                    target={objectId}
                                    countQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule {ipaenabledflag: true}) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAUser {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAUserGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule {ipaenabledflag: true}) RETURN p1,p2'
                                    }
                                    start={label}
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
