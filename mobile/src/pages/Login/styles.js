import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background: #f5f5f5;
  justify-content: center;
  align-items: center;
  padding: 30px;
`;

export const Image = styled.Image``;

export const Input = styled.TextInput`
  height: 46px;
  align-self: stretch;
  background: #fff;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 4px;
  margin-top: 20px;
  padding-top: 15px;
`;

export const ButtonInput = styled.TouchableOpacity`
  height: 46px;
  align-self: stretch;
  background: #df4723;
  border-radius: 4px;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

export const TextButton = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
