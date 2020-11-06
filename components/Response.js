import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import styled from 'styled-components';

import colors from '../lib/constants/colors';

import Avatar from './Avatar';
import Container from './Container';

const star = '/static/images/icons/star.svg';

const StarObject = styled.object`
  width: 14px;
  height: 14px;
  position: absolute;
  top: 45px;
  left: 0;
`;

class Response extends React.Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.messages = defineMessages({
      INTERESTED: {
        id: 'response.status.interested',
        defaultMessage: '{name} is interested',
      },
      YES: { id: 'response.status.yes', defaultMessage: '{name} is going' },
    });
  }

  render() {
    const { intl, response } = this.props;
    const { user, description, status } = response;

    if (!user) {
      return <div />;
    }

    const name =
      (user.name && user.name.match(/^null/) ? null : user.name) ||
      (user.email && user.email.substr(0, user.email.indexOf('@')));

    if (!name) {
      return <div />;
    }

    const linkTo = `/${user.slug}`;
    const title = intl.formatMessage(this.messages[status], { name });

    return (
      <a href={linkTo} title={title}>
        <div>
          <Container
            display="flex"
            alignItems="flex-start"
            width="100%"
            margin="10px"
            maxWidth="300px"
            float="left"
            position="relative"
            height="90px"
            overflow="hidden"
          >
            {status === 'INTERESTED' && <StarObject title={title} type="image/svg+xml" data={star} className="star" />}
            <Avatar collective={user} radius={40} />
            <Container padding="0.25rem 1rem">
              <Container fontSize="1.5rem">{name}</Container>
              <Container fontSize="1.2rem" style={{ color: colors.darkgray }}>
                {description || user.description}
              </Container>
            </Container>
          </Container>
        </div>
      </a>
    );
  }
}

export default injectIntl(Response);
