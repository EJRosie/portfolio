import React, { Component, SyntheticEvent } from "react";
// UI
import { Nav, NavItem, Tab } from "react-bootstrap";
import styled from "styled-components";
import {NAVBAR_HEIGHT, MOBILE_NAV_HEIGHT} from '../../common/nav/components';

const CountryTag = styled.span`
  padding: 3px 5px;
  border-radius: 3px;
  margin-right: 10px;
  background: #27273A;
  color: #787D95;
`;
const TabContainer = styled(Tab.Container)<{theaterMode: boolean}>`

  .tab-content {
    height: 53vw;
    max-height: 525px;
    ${props => props.theme.screen.md} {
      height: 36vw;
      max-height: 460px;
    }
  }

  margin-bottom: 40px;
  position: sticky;
  z-index: 2;
  top: ${MOBILE_NAV_HEIGHT};

  ${props => props.theaterMode ? `
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    flex: 1;
    width: 100%;
    height: 50%;
    ${props.theme.screen.md} {
      width: calc(70% - 20px);
      height: 100%;
    }
    @media(min-width: 1334px) {
      width: calc(100% - 420px);
    }
    .tab-content {
      height: 100%;
      ${props.theme.screen.md} {
        height: 44vw;
      }
      max-height: unset;
    }
    margin-right: 20px;
  `:
    `${props.theme.screen.sm} {
      position: relative;
      top: unset;
    }`
  }

  .nav.nav-tabs li {
    float: none;
    white-space: nowrap;
  }
  .nav.nav-tabs li > a {
    background-color: transparent;
    color: ${props => props.theme.textColors.grey};
    border: none;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
  .nav-tabs {
    margin-right: 150px;
    border-bottom: #242538 solid 2px;
    display: flex;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    i {
      margin-right: 10px;
    }
    &::-webkit-scrollbar {
      height: 0px;
    }
    background-color: ${props => props.theme.colors.background};
  }
  iframe {
    z-index: 1002;
  }
  .nav.nav-tabs .active > a {
    background-color: transparent;
    color: ${props => props.theme.textColors.white};
    border: none;
    border-bottom: 3px solid ${props => props.theme.colors.red};
    ${CountryTag} {
      background: white;
      color: #151522;
    }
  }
`;
const TheaterButton = styled.button`
  border: none;
  background: ${props => props.theme.colors.blue};
  color: ${props => props.theme.colors.whiteTrue};
  &:hover {
    opacity: 0.7;
  }
  position: absolute;
  right: 0;
  top: 6px;
  white-space: nowrap;
  height: 25px;
  font-size: 10px;
  font-weight: 600;
  margin: auto 0;
  margin-left: auto;
  text-transform: uppercase;
  border-radius: 5px;
  &>span:nth-child(2) {
    display: none;
    ${props => props.theme.screen.md} {
      display: inline-block;
    }
  }
  &>span:last-child {
    ${props => props.theme.screen.md} {
      display: none;
    }
  }
`;
const ScreenCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100%;
  background: green;
`;

interface ILocalProps { 
  streams: any[];
  theaterMode: boolean;
  toggleTheaterMode: () => void;
};

type IProps = ILocalProps

export default class LiveStreams extends Component<IProps> {
  public state = {
    tab: 0,
    theaterMode: false
  };


  public render() {
    if(this.props.streams.length < 1) {
      return <div></div>;
    }
    return (
      <TabContainer
        id="change-session"
        activeKey={this.state.tab}
        onSelect={(tab) => this.setState({tab})}
        theaterMode={this.props.theaterMode}
      >
        <div>
          <Nav bsStyle="tabs">
            {this.props.streams.map((stream, index) => 
              <NavItem eventKey={index} key={index}><CountryTag>{stream.country.short_name}</CountryTag><i className="fab fa-twitch"></i> {stream.display_name}</NavItem>
            )}
            <TheaterButton onClick={() => this.props.toggleTheaterMode()}>
              {
                !this.props.theaterMode ?
                  <><i className="fas fa-expand"></i> <span>Theater Mode</span><span>Chat Mode</span> </>
                :
                  <><i className="fas fa-times"></i> Close <span>Theater Mode</span><span>Chat Mode</span> </>
              }
            </TheaterButton>
          </Nav>

          <Tab.Content animation>
            <iframe
              src={`https://player.twitch.tv/?channel=${this.props.streams[this.state.tab].username}`}
              style={{ border: "none" }}
              height="100%"
              width="100%"
              scrolling="no"
              allowFullScreen
            />
          </Tab.Content>
        </div>
      </TabContainer>
    );
  }
}