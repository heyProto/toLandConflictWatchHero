import React from 'react';
import ReactDOM from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toLCWHero = function() {
    this.cardType = 'Card';
}

ProtoGraph.Card.toLCWHero.prototype.init = function(options) {
    this.options = options;
}

ProtoGraph.Card.toLCWHero.prototype.getData = function(data) {
    return this.containerInstance.exportData();
}

ProtoGraph.Card.toLCWHero.prototype.renderCol16 = function(data) {
    this.mode = 'col16';
    this.render();
}
ProtoGraph.Card.toLCWHero.prototype.renderCol4 = function(data) {
    this.mode = 'col4';
    this.render();
}
ProtoGraph.Card.toLCWHero.prototype.renderScreenshot = function(data) {
    this.mode = 'screenshot';
    this.render();
}

ProtoGraph.Card.toLCWHero.prototype.render = function() {
    ReactDOM.render(
    <Card
      dataURL={this.options.data_url}
      selector={this.options.selector}
      clickCallback={this.options.onClickCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}