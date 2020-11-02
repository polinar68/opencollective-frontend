import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Ban } from '@styled-icons/fa-solid/Ban';
import { Check } from '@styled-icons/fa-solid/Check';
import { Mail } from '@styled-icons/feather/Mail';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { padding } from 'styled-system';

import { getCollectiveMainTag } from '../../lib/collective.lib';
import { API_V2_CONTEXT, gqlV2 } from '../../lib/graphql/helpers';
import { CustomScrollbarCSS } from '../../lib/styled-components-shared-styles';

import Avatar from '../Avatar';
import Container from '../Container';
import { Box, Flex } from '../Grid';
import I18nCollectiveTags from '../I18nCollectiveTags';
import CommentIcon from '../icons/CommentIcon';
import LinkCollective from '../LinkCollective';
import MessageBox from '../MessageBox';
import StyledButton from '../StyledButton';
import StyledCollectiveCard from '../StyledCollectiveCard';
import StyledHr from '../StyledHr';
import StyledRoundButton from '../StyledRoundButton';
import StyledTag from '../StyledTag';
import { P, Span } from '../Text';

import ApplicationRejectionReasonModal from './ApplicationRejectionReasonModal';

const ApplicationBody = styled.div`
  height: 267px;
  overflow-y: auto;

  ${padding}
  ${CustomScrollbarCSS}

  @media (pointer: fine) {
    &::-webkit-scrollbar {
      width: 4px;
      border-radius: 8px;
    }
  }
`;

const CollectiveCardBody = styled.div`
  padding: 8px 16px 16px 16px;
  overflow-y: auto;
  height: 100%;
  ${CustomScrollbarCSS}
  @media (pointer: fine) {
    &::-webkit-scrollbar {
      width: 4px;
      border-radius: 8px;
    }
  }
`;

export const processApplicationAccountFields = gqlV2/* GraphQL */ `
  fragment ProcessHostApplicationFields on AccountWithHost {
    isActive
    approvedAt
    isApproved
    host {
      id
    }
  }
`;

const processApplicationMutation = gqlV2/* GraphQL */ `
  mutation ProcessHostApplication(
    $host: AccountReferenceInput!
    $account: AccountReferenceInput!
    $action: ProcessHostApplicationAction!
    $message: String
  ) {
    processHostApplication(host: $host, account: $account, action: $action, message: $message) {
      id
      ... on AccountWithHost {
        ...ProcessHostApplicationFields
      }
    }
  }
  ${processApplicationAccountFields}
`;

const ACTIONS = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  SEND_MESSAGE: 'SEND_MESSAGE',
};

const PendingApplication = ({ host, collective, ...props }) => {
  const [isDone, setIsDone] = React.useState(false);
  const [latestAction, setLatestAction] = React.useState(null);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [callProcessApplication, { loading, error, data }] = useMutation(processApplicationMutation, {
    context: API_V2_CONTEXT,
  });
  const applyMessage = null; // TODO: Doens't exist yet
  const isRejected = isDone && latestAction === ACTIONS.APPROVE;
  const isApproved = isDone && latestAction === ACTIONS.REJECT;
  const processApplication = async (action, message) => {
    setIsDone(false);
    setLatestAction(action);
    try {
      await callProcessApplication({
        variables: { host: { id: host.id }, account: { id: collective.id }, action, message },
      });
      setIsDone(true);
    } catch {
      // Ignore errors (handled through Apollo's `error`)
    }
  };

  return (
    <Container display="flex" flexDirection={['column', 'row']} border="1px solid #DCDEE0" borderRadius="16px">
      <StyledCollectiveCard
        collective={collective}
        bodyHeight={258}
        width={['100%', 224]}
        borderRadius={[16, '16px 0 0 16px']}
        borderWidth="0"
        showWebsite
        tag={
          <Flex mt={12}>
            <StyledTag type="warning" textTransform="uppercase" mr={2}>
              <FormattedMessage id="Pending" defaultMessage="Pending" />
            </StyledTag>
            <StyledTag variant="rounded-right">
              <I18nCollectiveTags
                tags={getCollectiveMainTag(get(collective, 'host.id'), collective.tags, collective.type)}
              />
            </StyledTag>
          </Flex>
        }
        {...props}
      >
        <CollectiveCardBody>
          {collective.admins.totalCount > 0 && (
            <Box>
              <Flex alignItems="center">
                <Span
                  color="black.500"
                  fontSize="9px"
                  textTransform="uppercase"
                  fontWeight="500"
                  letterSpacing="0.06em"
                >
                  <FormattedMessage id="Admins" defaultMessage="Admins" />
                </Span>
                <StyledHr borderColor="black.300" flex="1 1" ml={2} />
              </Flex>
              <Flex mt={2} alignItems="center">
                {collective.admins.nodes.slice(0, 6).map(admin => (
                  <Box key={admin.id} mr={1}>
                    <LinkCollective collective={admin.account}>
                      <Avatar collective={admin.account} radius="24px" />
                    </LinkCollective>
                  </Box>
                ))}
                {collective.admins.totalCount > 6 && (
                  <Container ml={2} pt="0.7em" fontSize="12px" color="black.600">
                    + {collective.admins.totalCount - 6}
                  </Container>
                )}
              </Flex>
            </Box>
          )}
          {collective.description && (
            <Box mt={3}>
              <Flex alignItems="center">
                <Span
                  color="black.500"
                  fontSize="9px"
                  textTransform="uppercase"
                  fontWeight="500"
                  letterSpacing="0.06em"
                >
                  <FormattedMessage id="OurPurpose" defaultMessage="Our purpose" />
                </Span>
                <StyledHr borderColor="black.300" flex="1 1" ml={2} />
              </Flex>
              <P mt={1} fontSize="12px" lineHeight="18px" color="black.800">
                {collective.description}
              </P>
            </Box>
          )}
        </CollectiveCardBody>
      </StyledCollectiveCard>
      <Container
        background="white"
        flex="1 1"
        borderLeft={[null, '1px solid #DCDEE0']}
        borderRadius={[16, '0 16px 16px 0']}
        minWidth={300}
        display="flex"
        flexDirection="column"
        alignItems="space-between"
        height={332}
      >
        <Box px="4px" position="relative">
          {error && (
            <Container position="absolute" bottom="15px" ml="5%" width="90%">
              <MessageBox type="error" withIcon>
                {error.message}
              </MessageBox>
            </Container>
          )}
          <ApplicationBody p={[12, 22]}>
            <Flex alignItems="center" mb={3}>
              <CommentIcon size={16} />
              <Span fontSize="11px" fontWeight="500" color="black.500" textTransform="uppercase" mx={2}>
                <FormattedMessage id="PendingApplication.Message" defaultMessage="Message for fiscal host" />
              </Span>
              <StyledHr borderColor="black.200" flex="1 1" />
            </Flex>
            {applyMessage ? (
              <P
                as="q"
                fontSize={['14px', '16px']}
                lineHeight="24px"
                fontStyle="italic"
                color="black.800"
                fontWeight="400"
              >
                {applyMessage}
              </P>
            ) : (
              <P color="black.500">
                <FormattedMessage id="NoMessage" defaultMessage="No message provided" />
              </P>
            )}
          </ApplicationBody>
        </Box>
        <Container
          display="flex"
          p={3}
          justifyContent="space-between"
          alignItems="center"
          borderTop="1px solid #DCDEE0"
          boxShadow="0px -2px 4px 0px rgb(49 50 51 / 6%)"
        >
          <Flex alignItems="center">
            <StyledRoundButton size={32}>
              <Mail size={15} color="#4E5052" />
            </StyledRoundButton>
            {isDone && latestAction === ACTIONS.SEND_MESSAGE && (
              <P color="black.700" ml={2}>
                <FormattedMessage id="MessageSent" defaultMessage="Message sent" />
              </P>
            )}
          </Flex>
          {isApproved || isRejected ? (
            <div>
              {isApproved ? (
                <P color="green.500">
                  <Check size={12} />
                  &nbsp;
                  <FormattedMessage id="PendingApplication.Approved" defaultMessage="Approved" />
                </P>
              ) : (
                <P color="red.500">
                  <Ban size={12} />
                  &nbsp;
                  <FormattedMessage id="PendingApplication.Rejected" defaultMessage="Rejected" />
                </P>
              )}
            </div>
          ) : (
            <Flex>
              <StyledButton
                buttonSize="tiny"
                buttonStyle="successSecondary"
                height={32}
                disabled={loading}
                loading={loading && latestAction === ACTIONS.APPROVE}
                onClick={() => processApplication(ACTIONS.APPROVE)}
              >
                <Check size={12} />
                &nbsp; <FormattedMessage id="actions.approve" defaultMessage="Approve" />
              </StyledButton>
              <StyledButton
                buttonSize="tiny"
                buttonStyle="dangerSecondary"
                ml={3}
                height={32}
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
                loading={loading && latestAction === ACTIONS.REJECT}
              >
                <Ban size={12} />
                &nbsp; <FormattedMessage id="actions.reject" defaultMessage="Reject" />
              </StyledButton>
            </Flex>
          )}
        </Container>
      </Container>
      <ApplicationRejectionReasonModal
        show={showRejectModal}
        collective={collective}
        onClose={() => setShowRejectModal(false)}
        onConfirm={async message => {
          setShowRejectModal(false);
          processApplication(ACTIONS.REJECT, message);
        }}
      />
    </Container>
  );
};

PendingApplication.propTypes = {
  host: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  collective: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    isApproved: PropTypes.bool,
    tags: PropTypes.array,
    type: PropTypes.string,
    host: PropTypes.shape({
      id: PropTypes.string,
    }),
    admins: PropTypes.shape({
      totalCount: PropTypes.number,
      nodes: PropTypes.array,
    }),
  }).isRequired,
};

export default PendingApplication;
