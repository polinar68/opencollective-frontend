import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle } from '@styled-icons/boxicons-regular/CheckCircle';
import { ChevronDown } from '@styled-icons/boxicons-regular/ChevronDown';
import { Dollar } from '@styled-icons/boxicons-regular/Dollar';
import { Envelope } from '@styled-icons/boxicons-regular/Envelope';
import { Receipt } from '@styled-icons/boxicons-regular/Receipt';
import themeGet from '@styled-system/theme-get';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { CollectiveType } from '../lib/constants/collectives';

import _ApplyToHostBtn from './ApplyToHostBtn';
import Container from './Container';
import { Box, Flex } from './Grid';
import Link from './Link';
import StyledTooltip from './StyledTooltip';
import { P } from './Text';

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
  callsToAction: { hasSubmitExpense, hasContact, hasApply },
}) => {
  const [showActionsMenu, toggleShowActionsMenu] = React.useState(false);
  const ApplyToHostBtn = () => (
    <_ApplyToHostBtn
      isBorderless
      host={collective}
      disabled={!hostWithinLimit}
      showConditions={false}
      minWidth={buttonsMinWidth}
      buttonSize="tiny"
    />
  );
  const hostedCollectivesLimit = get(collective, 'plan.hostedCollectivesLimit');
  const hostWithinLimit = hostedCollectivesLimit
    ? get(collective, 'plan.hostedCollectives') < hostedCollectivesLimit === true
    : true;
  const hasRequestGrant =
    [CollectiveType.FUND].includes(collective.type) || collective.settings?.fundingRequest === true;

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
                  {hasSubmitExpense && (
                    <ListItem>
                      <Flex mx={2}>
                        <BlueReceipt />
                      </Flex>
                      <P
                        as={Link}
                        route="create-expense"
                        params={{ collectiveSlug: collective.slug }}
                        my={2}
                        fontSize="12px"
                        textTransform="uppercase"
                        color="blue.600"
                      >
                        <FormattedMessage id="ExpenseForm.Submit" defaultMessage="Submit expense" />
                      </P>
                    </ListItem>
                  )}
                  {hasRequestGrant && (
                    <ListItem py={1}>
                      <Flex mx={2}>
                        <BlueDollar />
                      </Flex>
                      <P my={2} fontSize="12px" textTransform="uppercase" color="blue.600">
                        <FormattedMessage id="ExpenseForm.Type.Request" defaultMessage="Request Grant" />
                      </P>
                    </ListItem>
                  )}
                  {hasContact && (
                    <ListItem py={1}>
                      <Flex mx={2}>
                        <BlueEnvelope />
                      </Flex>
                      <P
                        as={Link}
                        route="collective-contact"
                        params={{ collectiveSlug: collective.slug }}
                        my={2}
                        fontSize="12px"
                        textTransform="uppercase"
                        color="blue.600"
                      >
                        <FormattedMessage id="Contact" defaultMessage="Contact" />
                      </P>
                    </ListItem>
                  )}
                  {hasApply && (
                    <ListItem py={1}>
                      <Flex mx={2}>
                        <BlueCheckCircle />
                      </Flex>
                      {hostWithinLimit ? (
                        <ApplyToHostBtn />
                      ) : (
                        <StyledTooltip
                          place="left"
                          content={
                            <FormattedMessage
                              id="host.hostLimit.warning"
                              defaultMessage="Host already reached the limit of hosted collectives for its plan. <a>Contact {collectiveName}</a> and let them know you want to apply."
                              values={{
                                collectiveName: collective.name,
                                // eslint-disable-next-line react/display-name
                                a: chunks => <Link route={`/${collective.slug}/contact`}>{chunks}</Link>,
                              }}
                            />
                          }
                        >
                          <ApplyToHostBtn />
                        </StyledTooltip>
                      )}
                    </ListItem>
                  )}
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
    type: PropTypes.string,
    settings: PropTypes.object,
  }),
  callsToAction: PropTypes.shape({
    /** Button to contact the collective */
    hasContact: PropTypes.bool,
    /** Submit new expense button */
    hasSubmitExpense: PropTypes.bool,
    /** Hosts "Apply" button */
    hasApply: PropTypes.bool,
  }).isRequired,
  /** Will apply a min-width to all buttons */
  buttonsMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

CollectiveNavbarActionsMenu.defaultProps = {
  callsToAction: {},
  buttonsMinWidth: 100,
};

export default CollectiveNavbarActionsMenu;
