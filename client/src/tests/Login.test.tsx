import { mount } from 'enzyme';
import Login from '../components/Login';
import Enzyme, { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { BrowserRouter as Router } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

Enzyme.configure({ adapter: new Adapter() });

describe('Register', () => {
  let wrapper: Enzyme.ReactWrapper;
  beforeEach(async () => {

    const mock = new AxiosMockAdapter(axios);

    mock.onGet('/api/login').reply(200, {
      "data": "jwttoken123"
    });

    await act(async () => {
      wrapper = mount(<Router><Login /></Router>);
    });
  });

  it('should show the heading', async () => {
    const element = wrapper.find('h1');
    expect(element.text()).toBe('Sign in');
  });

  it('should show all visual elements', () => {
    const avatar = wrapper.find(Avatar);
    expect(avatar.exists()).toBeTruthy();
    const avatarIcon = wrapper.find(LockOutlinedIcon);
    expect(avatarIcon.exists()).toBeTruthy();

    const emailLabel = wrapper.find("label#email-label");
    expect(emailLabel.exists()).toBeTruthy();
    expect(emailLabel.text()).toBe('Email Address');
    const emailInput = wrapper.find("input[name=\"email\"]");
    expect(emailInput.exists()).toBeTruthy();
    const passwordLabel = wrapper.find("label#password-label");
    expect(passwordLabel.exists()).toBeTruthy();
    expect(passwordLabel.text()).toBe('Password');
    const passwordInput = wrapper.find("input[name=\"password\"]");
    expect(passwordInput.exists()).toBeTruthy();

    const button = wrapper.find(Button);
    expect(button.exists()).toBeTruthy();
    expect(button.text()).toBe('Sign In');

    const ahref = wrapper.find("a");
    expect(ahref.exists()).toBeTruthy();
    expect(ahref.prop('href')).toBe('/register');
  });
});