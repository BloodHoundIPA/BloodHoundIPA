import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import General from './General';
import References from './References';

const IPAMemberManager = ({ sourceName, sourceType, targetName, targetType }) => {
    return (
        <Tabs defaultActiveKey={1} id='tab-style' bsStyle='pills' justified>
            <Tab eventKey={1} title='GENERAL'>
                <General
                    sourceName={sourceName}
                    sourceType={sourceType}
                    targetName={targetName}
                />
            </Tab>
            <Tab eventKey={2} title='REFERENCES'>
                <References />
            </Tab>
        </Tabs>
    );
};

IPAMemberManager.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
    targetType: PropTypes.string,
};
export default IPAMemberManager;
