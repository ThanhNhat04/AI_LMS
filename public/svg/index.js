// IconXMark.js
import React from 'react';

export const IconXMark = ({ width = 24, height = 24, className = "", style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width={width}
    height={height}
    className={`${className}`}
    style={{
      backgroundColor: "white",
      padding: "8px",
      border: "none",
      outline: "none",
      borderRadius: "8px",
      fill: "black",
      ...style,
    }}
  >
    <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
  </svg>
);

export const IconUser = ({ width = 24, height = 24, className = "", style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={width}
    height={height}
    className={className}
    style={{
      backgroundColor: "white",
      padding: "8px",
      border: "none",
      outline: "none",
      borderRadius: "8px",
      fill: "black",
      ...style,
    }}
  >
    <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/>
  </svg>
);

export const IconLock = ({ width = 24, height = 24, className = "", style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    width={width}
    height={height}
    className={className}
    style={{
      backgroundColor: "white",
      padding: "8px",
      border: "none",
      outline: "none",
      borderRadius: "8px",
      fill: "black",
      ...style,
    }}
  >
    <path d="M256 160L256 224L384 224L384 160C384 124.7 355.3 96 320 96C284.7 96 256 124.7 256 160zM192 224L192 160C192 89.3 249.3 32 320 32C390.7 32 448 89.3 448 160L448 224C483.3 224 512 252.7 512 288L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 288C128 252.7 156.7 224 192 224z"/>
  </svg>
);

