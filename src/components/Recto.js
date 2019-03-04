import React, { Component } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export default class Recto extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let blockRepresentation;
    let block = this.props.block;

    if (this.props.blockType === 'Image') {
      blockRepresentation = (
        <div className="block block--image">
          <img src={block.image.original.url} alt="" />
        </div>
      )
    } else if (this.props.blockType === 'Text') {
      blockRepresentation = (
        <div className="block block--text">
          <p>{ReactHtmlParser(block.content_html)}</p>
        </div>
      )
    } else if (this.props.blockType === 'Link' && block.source) {
      blockRepresentation = (
        <div className="block block--link">
          <a href={block.source.url}>
            <div className="block--link__thumbnail">
              <img src={block.image.display.url} alt="" />
              <p>{block.source.url}</p>
            </div>
          </a>
        </div>
      )
    } else if (this.props.blockType === 'Attachment') {
      blockRepresentation = (
        <div className="block block--attachment">
          <a href={block.attachment.url}>
            <div className="block--attachment__thumnbail">
              <img src={block.image ? block.image.display.url : ''} alt="" />
              <p>{block.generated_title}</p>
            </div>
          </a>
        </div>
      )
    } else if (this.props.blockType === 'Media') {
      blockRepresentation = (
        <div className="block block--media">
          {ReactHtmlParser(block.embed.html)}
        </div>
      )
    } else if (this.props.blockType === 'Channel') {
      blockRepresentation = (
        <div className="block block--channel">
          <p>{block.title}</p>
        </div>
      )
    }

    return (
      <div className="recto">
        {blockRepresentation}
      </div>
    )
  }
}