import styled from "styled-components";
import {
  palette,
  spacing,
  borders,
  display,
  sizing,
  typography
} from "@material-ui/system";
import is, { isOr } from "util/styledIs";

export const Box = styled.div`
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    ${typography}

    ${is("!absolute", "full")`
        width: 100%;
        height: 100%;
        flex-basis: 100%;
    `};

    ${is("hide")`
        display: none;
    `};

    
    ${is("fixed")`
        position: fixed;
    `};

    ${is("fullHeight")`
        height: 100%;
        flex-basis: 100%;
    `};
    
    ${is("fullWidth")`
        width: 100%;
        flex-basis: 100%;
    `};


    ${is("absolute", "full")`
        position: absolute;
        left: 0px; right: 0px; top: 0px; bottom: 0px;
    `};

    ${is("fixed", "full")`
    left: 0px; right: 0px; top: 0px; bottom: 0px;
`};

    ${isOr("inlineBlock", "inline")`
        display: inline-block;
    `};
    ${is("inlineFlex")`
        display: inline-flex;
    `};

    ${is("flex")`
        display: flex;
    `};

    ${is("background")`
        background: ${props => props.background};
    `};

    ${is("zIndex")`
        z-index: ${props => props.zIndex};
    `};
    ${is("float")`
        float: ${props => (props.float === true ? "left" : props.float)};
    `};

    ${is("table")`
        display: table;
    `};
    ${is("tableCell")`
        display: table-cell;
    `};
    ${is("tableRow")`
        display: table-row;
    `};
    ${is("scroll")`
        overflow: auto;
    `};
    ${is("scrollVisible")`
        overflow: scroll;
    `};
    ${is("scrollY")`
        overflow-y: auto;
    `};
    ${is("scrollX")`
    overflow-x: auto;
    `};

    ${is("noOverflow")`
        overflow: hidden;
    `};

    ${is("noOverflowX")`
        overflow-x: hidden;
    `};
    
    ${is("noOverflowY")`
        overflow-y: hidden;
    `};
    
    ${is("hideScrollBars")`
        ::-webkit-scrollbar { 
            display: none;  /* Chrome Safari */
            width: 0;
            height: 0;
        }
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE 10+ */
    
    `};
    ${is("relative")`
        position: relative;
    `};

    ${is("absolute")`
        position: absolute;
    `};

    ${is("absolute", "center")`
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 0px;
        margin: auto;
    `}; 

    ${is("absolute", "topRight")`
        right: 0px;
        top: 0px;
        margin: auto;
    `}; 

    ${is("absolute", "right")`
        right: 0px;
        top: 0px;
        bottom: 0px;
    `}; 

    ${is("column")`
        display: flex;
        flex-direction: column;
    `};
    ${is("flexWrap")`
        flex-wrap: wrap;
    `};
    ${is("wrapReverse")`
        flex-wrap: wrap-reverse;
    `};
    ${is("flexCenter")`
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
    `};
    /***************************** justify-content *****************************/
    /************* http://cssreference.io/property/justify-content *************/
    ${is("justifyStart")`
        justify-content: flex-start; /* default */
    `};
    ${is("justifyEnd")`
        justify-content: flex-end;
    `};
    ${is("justifyCenter")`
        justify-content: center;
    `};
    ${is("justifyBetween")`
        justify-content: space-between;
    `};
    ${is("justifyAround")`
        justify-content: space-around;
    `};
    /****************************** align-content ******************************/
    /************** http://cssreference.io/property/align-content **************/
    ${is("contentStart")`
        align-content: flex-start;
    `};
    ${is("contentEnd")`
        align-content: flex-end;
    `};
    ${is("contentCenter")`
        align-content: center;
    `};
    ${is("contentSpaceBetween")`
        align-content: space-between;
    `};
    ${is("contentSpaceAround")`
        align-content: space-around;
    `};
    ${is("contentStretch")`
        align-content: stretch; /* default */
    `};
    /******************************* align-items *******************************/
    /*************** http://cssreference.io/property/align-items ***************/
    ${is("alignStart")`
        align-items: flex-start;
    `};
    ${is("alignEnd")`
        align-items: flex-end;
    `};
    ${is("alignCenter")`
        align-items: center;
    `};
    ${is("alignBaseline")`
        align-items: baseline;
    `};
    ${is("alignStretch")`
        align-items: stretch;
    `};
    /******************************** utilities ********************************/

    /********************************** order **********************************/
    /****************** http://cssreference.io/property/order ******************/
    ${is("order")`
        order: ${props => props.order};
    `};

    /******************************** flex-basis ********************************/
    /**************** http://cssreference.io/property/flex-basis ****************/
    ${is("basis")`
        flex-basis: ${props => props.basis};
    `};

    /******************************** flex-grow ********************************/
    /**************** http://cssreference.io/property/flex-grow ****************/
    ${is("grow")`
        flex-grow: ${props => (props.grow === true ? 1 : props.grow)};
    `};

    /******************************* flex-shrink *******************************/
    /*************** http://cssreference.io/property/flex-shrink ***************/
    ${is("shrink")`
        flex-shrink: ${props => props.shrink || 1};
    `};
    ${is("noShrink")`
        flex-shrink: 0;
    `};

`;

export default Box;
