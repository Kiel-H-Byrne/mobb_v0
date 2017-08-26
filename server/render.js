import { onPageLoad } from "meteor/server-render";

let linkTags = `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /> `;

let styleTag = `
<style type="text/css">
  /* LOADING SCREEN */
    #loading-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100; }

  #loading-wrapper .content-wrapper {
    width: 20rem;
    height: 20rem;
    margin: auto; }

  #loading-text {
    display: block;
    position: absolute;
    line-height: 100%;
    font-size: 4rem;
    text-align: center;
    bottom: 30%;
    margin: auto; }

  #loading-content {
    display: block;
    position: relative;
    margin: auto;
    top: 33%;
    width: 100%;
    height: 100%;
    border: 3px solid #00A466;
    border: 3px solid transparent;
    border-top-color: #824691;
    border-bottom-color: #824691;
    border-radius: 50%;
    -webkit-animation: loader 2s linear infinite;
    -moz-animation: loader 2s linear infinite;
    -o-animation: loader 2s linear infinite;
    animation: loader 2s linear infinite; }
    
    #loading-content:after {
      content: "";
      position: absolute;
      border: 3px solid #2985F2;
      left: 15px;
      right: 15px;
      top: 15px;
      bottom: 15px; }
    #loading-content:before {
      content: "";
      position: absolute;
      left: 5px;
      right: 5px;
      top: 5px;
      bottom: 5px;
      border: 3px solid transparent;
      border-top-color: #FF9C00;
      border-bottom-color: #FF9C00;
      border-radius: 50%;
      -webkit-animation: loader 3s linear infinite;
      -moz-animation: loader 2s linear infinite;
      -o-animation: loader 2s linear infinite;
      animation: loader 3s linear infinite; }
    #loading-content:after {
      border: 3px solid transparent;
      border-top-color: #00F0AE;
      border-bottom-color: #00F0AE;
      border-radius: 50%;
      -webkit-animation: loader 1.5s linear infinite;
      animation: loader 1.5s linear infinite;
      -moz-animation: loader 2s linear infinite;
      -o-animation: loader 2s linear infinite; }

  @-webkit-keyframes loaders {
    0% {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg); }
    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg); } }

  @keyframes loader {
    0% {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg); }
    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg); } }

  /* NAV BAR */
  .navbar-fixed nav {
  background-color: rgba(086,082,080,.9); }

  /* MATERIAL ICONS */
  
  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }

  </style>
`;

let loadingDiv = `
  <div id="loading-wrapper" class="server_rendered">

    <div class="content-wrapper">
      <div id="loading-text">LOADING...</div>
      <div id="loading-content"></div>
    </div>
  </div>
  `;

let navDiv = `
<div class="navbar-fixed server_rendered">
<nav><a href="/?whywait" > </a></nav>
</div>
`;

onPageLoad(sink => {
  sink.appendToHead(linkTags + styleTag);
  sink.appendToBody(loadingDiv);
});
