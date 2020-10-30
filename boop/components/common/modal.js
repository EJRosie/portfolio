import React, { Fragment } from 'react';
import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Modal, TouchableWithoutFeedback, RefreshControl, KeyboardAvoidingView, Keyboard } from 'react-native';
import { COLORS } from '../../../native-base-theme/variables/material';
import { Container, Content, Body, Button, Icon, Text, View, Toast, Root } from 'native-base';
export default class CommonModal extends React.Component {

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!this.props.show}
        onRequestClose={() => this.props.close()}
      >
        <CloseModalOverlay onPressOut={() => this.props.close()}>
          <ModalContainer>
            <MenuContainer>
            {this.renderButtons()}
            </MenuContainer>
          </ModalContainer>
        </CloseModalOverlay>
      </Modal>
    );
  }

  renderButtons() {
    return (this.props.buttons.map(item => {
      return  (
        <ModalButton onPress={item.function.bind(this)}>
          <ModalIcon style={{ color: item.iconColor || COLORS.RED }} type={item.iconFamily || "FontAwesome5"} name={item.iconName} />
          <ModalText style={{ color: item.textColor || COLORS.RED }}>{item.text}</ModalText>
        </ModalButton>
      )
    }));
  }
}
const ModalIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  font-size: 24px;
`;
const ModalContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
`;
const MenuContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  box-shadow: 0px -3px 20px rgba(0, 0, 0, 0.08);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-top: 10px;
  background-color: ${COLORS.WHITE};
`;
const CloseModalOverlay = styled(TouchableWithoutFeedback) `
`;
const ModalButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  padding-horizontal: 24px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 56px;
`;
const ModalText = styled.Text `
  align-self: center;
  margin-left: 18px;
  font-size: 16px;
`;