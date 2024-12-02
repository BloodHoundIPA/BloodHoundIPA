import React from 'react';
import PropTypes from 'prop-types';
import { typeFormat } from '../Formatter';
const General = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                FreeIPA’s host-based access control (HBAC) feature allows you to 
                define policies that restrict access to hosts or services based 
                on the user attempting to log in and that user’s groups, the host 
                that they are trying to access (or its Host Groups), and (optionally) 
                the service being accessed.
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