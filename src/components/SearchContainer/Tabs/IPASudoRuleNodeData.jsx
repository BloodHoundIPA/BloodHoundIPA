import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import styles from './NodeData.module.css';

const IPASudoRuleNodeData = () => {
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
        if (type === 'IPASudoRule') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPASudoRule {objectid: $objectid}) RETURN n AS node`, {
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
                                    property='Users'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPAUser)-[r:IPASudoRuleTo]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='User Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPAUserGroup)-[r:IPASudoRuleTo]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Hosts'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPAHost)-[r:IPASudoRuleTo]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Host Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPAHostGroup)-[r:IPASudoRuleTo]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Allow Sudo Commands'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPASudo)-[r:IPAMemberOf {allow: true}]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Deny Sudo Commands'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPASudo)-[r:IPAMemberOf {allow: false}]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Allow Sudo Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPASudoGroup)-[r:IPAMemberOf {allow: true}]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='Deny Sudo Groups'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n:IPASudoGroup)-[r:IPAMemberOf {allow: false}]->(g:IPASudoRule {objectid: $objectid})'
                                    }
                                    end={label}
                                />
                                <NodeCypherLink
                                    property='All Relationships'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[r:IPASudoRuleTo]->(g:IPASudoRule {objectid: $objectid})'
                                    }
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

IPASudoRuleNodeData.propTypes = {};
export default IPASudoRuleNodeData;
