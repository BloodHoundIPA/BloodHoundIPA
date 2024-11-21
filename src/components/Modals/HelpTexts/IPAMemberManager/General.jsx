import React from 'react';
import PropTypes from 'prop-types';
import { typeFormat } from '../Formatter';

const General = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
            A member manager is a principal that is able to manage members of a group. 
            Member managers are able to add new members to a group or remove existing members from a group. 
            They cannot modify additional attributes of a group as a part of the member manager role.

            Member management is implemented for user groups and host groups. 
            Membership can be managed by users or user groups. Member managers are independent from members. 
            A principal can be a member manager of a group without being a member of a group.
            </p>
        </>
    );
};

General.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
};

export default General;
