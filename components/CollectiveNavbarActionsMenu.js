import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from '@styled-icons/boxicons-regular/ChevronDown';
import { Dollar } from '@styled-icons/boxicons-regular/Dollar';
import { Receipt } from '@styled-icons/boxicons-regular/Receipt';
import { CheckCircle } from '@styled-icons/boxicons-regular/CheckCircle';
import { Envelope } from '@styled-icons/boxicons-regular/Envelope';
import themeGet from '@styled-system/theme-get';
import { get, uniqBy } from 'lodash';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Container from './Container';
import { Box, Flex } from './Grid';
import Hide from './Hide';
import StyledLink from './StyledLink';
import StyledRoundButton from './StyledRoundButton';
import { P } from './Text';
import { withUser } from './UserProvider';

//  Styled components
const BlueChevronDown = styled(ChevronDown)`
  color: ${themeGet('colors.blue.600')};
  width: 24px;
  height: 24px;
`;
const BlueReceipt = styled(Receipt)`
  color: ${themeGet('colors.blue.600')};
  width: 20px;
  height: 20px;
`;
const BlueDollar = styled(Dollar)`
  color: ${themeGet('colors.blue.600')};
  width: 20px;
  height: 20px;
`;
const BlueEnvelope = styled(Envelope)`
  color: ${themeGet('colors.blue.600')};
  width: 20px;
  height: 20px;
`;
const BlueCheckCircle = styled(CheckCircle)`
  color: ${themeGet('colors.blue.600')};
  width: 20px;
  height: 20px;
`;

const ListItem = styled(Flex).attrs({
  alignItems: 'center',
  py: '1',
})`
  cursor: pointer;
`;

const MenuOutline = styled(Container).attrs({
  minWidth: '50px',
  maxWidth: '200px',
  width: '100%',
  position: 'absolute',
  right: 35,
  top: 60,
  zIndex: 3000,
  bg: 'white.full',
  border: ['none', '1px solid rgba(18,19,20,0.12)'],
  borderRadius: [0, 12],
  boxShadow: '0 4px 8px 0 rgba(61,82,102,0.08)',
})``;

const CollectiveNavbarActionsMenu = ({
  collective,
  buttonsMinWidth,
  callsToAction: {
    hasContribute,
    hasSubmitExpense,
    hasContact,
    hasApply,
    hasDashboard,
    hasManageSubscriptions,
    addFunds,
  },
  ...props
}) => {
  const intl = useIntl();

  const [showActionsMenu, toggleShowActionsMenu] = React.useState(false);

  return (
    <Container display="flex">
      <Flex alignItems="center" onClick={() => toggleShowActionsMenu(!showActionsMenu)}>
        <P my={2} fontSize="16px" textTransform="uppercase" color="blue.700">
          <FormattedMessage id="CollectivePage.NavBar.ActionMenu.Actions" defaultMessage="Actions" />
        </P>
        <BlueChevronDown size="1.5em" cursor="pointer" />
        {showActionsMenu && (
          <MenuOutline>
            <Flex flexDirection={['column', 'row']} maxHeight={['calc(100vh - 68px)', '100%']}>
              <Box order={[2, 1]} flex="10 1 50%" width={[1, 1, 1 / 2]} px={3} py={1} bg="white.full">
                <Box as="ul" p={0} my={2}>
                  <ListItem>
                    <Flex mx={2}>
                      <BlueReceipt />
                    </Flex>
                    <P my={2} fontSize="12px" textTransform="uppercase" color="blue.600">
                      <FormattedMessage id="ExpenseForm.Submit" defaultMessage="Submit expense" />
                    </P>
                  </ListItem>
                  <ListItem py={1}>
                    <Flex mx={2}>
                      <BlueDollar />
                    </Flex>
                    <P my={2} fontSize="12px" textTransform="uppercase" color="blue.600">
                      <FormattedMessage id="ExpenseForm.Type.Request" defaultMessage="Request Grant" />
                    </P>
                  </ListItem>
                  <ListItem py={1}>
                    <Flex mx={2}>
                      <BlueEnvelope />
                    </Flex>
                    <P my={2} fontSize="12px" textTransform="uppercase" color="blue.600">
                      <FormattedMessage id="Contact" defaultMessage="Contact" />
                    </P>
                  </ListItem>
                  <ListItem py={1}>
                    <Flex mx={2}>
                      <BlueCheckCircle />
                    </Flex>
                    <P my={2} fontSize="12px" textTransform="uppercase" color="blue.600">
                      <FormattedMessage id="Actions.ApplyToHost" defaultMessage="Apply to this host" />
                    </P>
                  </ListItem>
                </Box>
              </Box>
            </Flex>
          </MenuOutline>
        )}
      </Flex>
    </Container>
  );
};

CollectiveNavbarActionsMenu.propTypes = {
  collective: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    plan: PropTypes.object,
    host: PropTypes.object,
    settings: PropTypes.object,
    tiers: PropTypes.arrayOf(PropTypes.object),
    parentCollective: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }),
  callsToAction: PropTypes.shape({
    /** Button to contact the collective */
    hasContact: PropTypes.bool,
    /** Donate / Send Money button */
    hasContribute: PropTypes.bool,
    /** Submit new expense button */
    hasSubmitExpense: PropTypes.bool,
    /** Hosts "Apply" button */
    hasApply: PropTypes.bool,
    /** Hosts "Dashboard" button */
    hasDashboard: PropTypes.bool,
    /** Link to edit subscriptions */
    hasManageSubscriptions: PropTypes.bool,
    /** Link to add funds */
    addFunds: PropTypes.bool,
  }).isRequired,
  /** Will apply a min-width to all buttons */
  buttonsMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

CollectiveNavbarActionsMenu.defaultProps = {
  callsToAction: {},
  buttonsMinWidth: 100,
};

export default CollectiveNavbarActionsMenu;
