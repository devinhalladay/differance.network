import React, { Component } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export default class Sheet extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let blockRepresentation;
    let block = this.props.block;

    if (this.props.blockType === 'Image' && block.image) {
      blockRepresentation = (
        <div className="block block--image">
          <img src={block.image.original.url} alt="" />
        </div>
      )
    } else if (this.props.blockType === 'Text') {
      blockRepresentation = (
        <div className="block block--text">
          {ReactHtmlParser(block.content_html)}
        </div>
      )
    } else if (this.props.blockType === 'Link' && block.source) {
      blockRepresentation = (
        <div className="block block--link">
          <a href={block.source.url}>
            <div className="block--link__thumbnail">
              <img src={block.image.display.url} alt="" />
              <p>{block.generated_title}</p>
            </div>
          </a>
        </div>
      )
    } else if (this.props.blockType === 'Attachment' && block.attachment) {
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
    } else if (this.props.blockType === 'Media' && block.embed) {
      blockRepresentation = (
        <div className="block block--media">
          {ReactHtmlParser(block.embed.html)}
        </div>
      )
    } else if (this.props.blockType === 'Channel') {
      blockRepresentation = (
        <div className={`block block--channel ${block.open ? 'open' : ''}`}>
          <a target="_blank" href={`http://are.na/${block.user.slug}/${block.slug}`}>
            <p>{block.title}</p>
            <small>{block.user.full_name}</small>
            <small>{block.length} Blocks</small>
          </a>
        </div>
      )
    }

    return (
      <div className={this.props.side}>
        {blockRepresentation}
      </div>
    )
  }
}