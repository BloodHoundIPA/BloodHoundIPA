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

const IPAPermissionNodeData = () => {
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
        if (type === 'IPAPermission') {
            setVisible(true);
            setObjectId(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAPermission {objectid: $objectid}) RETURN n AS node`, {
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
        description: 'Description',
        highvalue: 'High Value',
        name: 'Name',
        objectclass: 'Object Class',        
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
                                    property='Memberships'
                                    target={objectId}
                                    baseQuery={
                                        'MATCH p=(:IPAPermission {objectid: $objectid})-[:IPAMemberOf*1..]->(n:IPAPermissionRule)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Memberships Allow'
                                    target={objectId}
                                    countQuery={
                                        'OPTIONAL MATCH p1=(s1:IPAPermission {objectid: $objectid})-[r1:IPAMemberOf {allow: true}]->(n1:IPAPermissionRule) OPTIONAL MATCH p2=(s1)-[r2:IPAMemberOf]->(g2:IPAPermissionGroup)-[r3:IPAMemberOf {allow: true}]->(n2:IPAPermissionRule) return count(p1)+count(p2)'
                                    }
                                    graphQuery={
                                        'OPTIONAL MATCH p1=(s1:IPAPermission {objectid: $objectid})-[r1:IPAMemberOf {allow: true}]->(n1:IPAPermissionRule) OPTIONAL MATCH p2=(s1)-[r2:IPAMemberOf]->(g2:IPAPermissionGroup)-[r3:IPAMemberOf {allow: true}]->(n2:IPAPermissionRule) return p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Memberships Deny'
                                    target={objectId}
                                    countQuery={
                                        'OPTIONAL MATCH p1=(s1:IPAPermission {objectid: $objectid})-[r1:IPAMemberOf {allow: false}]->(n1:IPAPermissionRule) OPTIONAL MATCH p2=(s1)-[r2:IPAMemberOf]->(g2:IPAPermissionGroup)-[r3:IPAMemberOf {allow: false}]->(n2:IPAPermissionRule) return count(p1)+count(p2)'
                                    }
                                    graphQuery={
                                        'OPTIONAL MATCH p1=(s1:IPAPermission {objectid: $objectid})-[r1:IPAMemberOf {allow: false}]->(n1:IPAPermissionRule) OPTIONAL MATCH p2=(s1)-[r2:IPAMemberOf]->(g2:IPAPermissionGroup)-[r3:IPAMemberOf {allow: false}]->(n2:IPAPermissionRule) return p1,p2'
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

                {/* <Notes objectid={objectId} type={'IPAPermission'} />
                <NodeGallery
                    objectid={objectId}
                    type={'IPAPermission'}
                    visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAPermissionNodeData.propTypes = {};
export default withAlert()(IPAPermissionNodeData);
