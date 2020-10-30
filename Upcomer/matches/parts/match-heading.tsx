import styled from "styled-components";

const Heading = styled.div`
  position: relative;
  display: inline-block;
  font-size: 28px;
  line-height: normal;
  margin-bottom: 15px;
  font-family: alternate-gothic-no-3-d, sans-serif;
  color: ${props => props.theme.colors.grey};
  text-transform: uppercase;
`;

const StyledBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px
  position: absolute;
  top: 16px;
  right: 0;
  font-size: 14px;
  padding: 3px 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.home.sectionHeading.badgeBackground};
  color: ${props => props.theme.home.sectionHeading.badgeFontColor};
  font-family: ${props => props.theme.app.fontFamily};
`;

export interface IProps {
  badge?: number;
  color?: string;
  children: any;
}

export default (props: IProps) => (
  <Heading>
    {props.children}
    {props.badge ? <StyledBadge>{props.badge}</StyledBadge> : false}
  </Heading>
);
