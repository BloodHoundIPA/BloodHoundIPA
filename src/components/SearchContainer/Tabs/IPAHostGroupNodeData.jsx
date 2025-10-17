import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import styles from './NodeData.module.css';

const IPAHostGroupNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
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
        if (type === 'IPAHostGroup') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAHostGroup {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    session.close();
                });
        } else {
            setObjectid(null);
            setVisible(false);
        }
    };

    const displayMap = {
        objectid: 'Object ID',
        description: 'Description',
        admincount: 'Admin Count',
    };

    return objectid === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectid}</h5>

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

                <CollapsibleSection header='MEMBER'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Hosts'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPAHost)-[r:IPAMemberOf]->(g:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Host Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPAHostGroup)-[r:IPAMemberOf]->(g:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='MEMBER OF'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Host Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(g:IPAHostGroup {objectid: $objectid})-[r:IPAMemberOf]->(n:IPAHostGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLink
                                    property='Network Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(g:IPAHostGroup {objectid: $objectid})-[r:IPAMemberOf]->(n:IPANetGroup)'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='HBAC Rules'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled HBAC Rules'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule {ipaenabledflag: true}) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPAHBACRuleTo]->(n:IPAHBACRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPAHBACRuleTo]->(n1:IPAHBACRule {ipaenabledflag: true}) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Sudo Rules'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                                <NodeCypherLinkComplex
                                    property='Enabled Sudo Rules'
                                    target={objectid}
                                    countQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule {ipaenabledflag: true}) WITH collect(n) + collect(n1) AS all_nodes UNWIND all_nodes AS node RETURN COUNT(DISTINCT node)'
                                    }
                                    graphQuery={
                                        'MATCH (s:IPAHostGroup {objectid: $objectid}) WITH s OPTIONAL MATCH p1=(s)-[r1:IPASudoRuleTo]->(n:IPASudoRule {ipaenabledflag: true}) OPTIONAL MATCH p2=(s)-[r2:IPAMemberOf*1..10]->(g2:IPAHostGroup)-[r3:IPASudoRuleTo]->(n1:IPASudoRule {ipaenabledflag: true}) RETURN p1,p2'
                                    }
                                    start={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='MEMBER MANAGERS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='Users and User Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[b:IPAMemberManager]->(c:IPAHostGroup {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {/*  <Notes objectid={objectid} type='Group' />
                 <NodeGallery
                     objectid={objectid}
                     type='Group'
                     visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAHostGroupNodeData.propTypes = {};
export default IPAHostGroupNodeData;
