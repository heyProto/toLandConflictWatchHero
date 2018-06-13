import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      mappingJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      currentTab: ''
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if(this.props.mappingJSON){
      stateVar.mappingJSON = this.props.mappingJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }
    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let mappingJSON_URL = 'https://cdn.protograph.pykih.com/55825b09931bee16055a/mapping.json';
      let items_to_fetch = [
        axios.get(this.props.dataURL),
        axios.get(mappingJSON_URL)
      ];

      axios.all(items_to_fetch).then(axios.spread((card, mapping) => {
         // console.log(mapping, card, "mapping")
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          mappingJSON: mapping.data,
          optionalConfigJSON:{}
        };
        this.setState(stateVar);
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON,
      });
    }
    this.selectTab();
  }

  selectTab(){
    if (this.props.page_url) {
      let d = this.state.mappingJSON.filter((e) => this.props.page_url == e.page_id)[0],
        tab = d.tab;
      // console.log(tab , "tab")
      return tab;
    } else {
      return 1;
    }
  }

  handleTabClick(tab){
    let d = this.state.mappingJSON.filter((e) => tab === e.tab) [0],
      url = this.props.origin +""+ d.url;
    this.setState({
      currentTab: tab
    });
    window.open(url, '_top');
  }

  renderTabs(tabs){
    let tabNames;
    let tabClass;
    console.log(this.props.origin)
    tabNames = tabs.map((tab,i)=>{
      let currTab = this.state.currentTab === '' ? this.selectTab() : this.state.currentTab;
      tabClass = (i+1 === currTab)? "single-tab active":"single-tab";
      return(
        <a key={i.toString()} className="tab-links" onClick={()=>this.handleTabClick(i+1)}>
          <div className={tabClass}>
            {tab.title}
            <div className="tab-value">
              {this.formatNumber(tab.number)}
              <img src={tab.tabIcon} height="24px"/>
            </div>
          </div>
        </a>
      )
    })
    return tabNames;
  }

  formatNumber(num){
    let rev = "";
    let frNumRev="";
    let frNum = '';
    let remain;
    for (var i = num.length - 1; i >= 0; i--) {
        rev += num[i];
    }
    remain = rev;
    frNum = remain.slice(0,3);
    if(num.length>3){
      frNum += ',';
      remain = remain.slice(3);
      while(remain.length>0){
        if(remain.length<=2){
          frNum += remain;
          break;
        }
        else{
          frNum += remain.slice(0,2)+',';
          remain = remain.slice(2);
        }
      }
    }
    for (var i = frNum.length - 1; i >= 0; i--) {
      frNumRev += frNum[i];
    }
    return frNumRev;
  }

  renderTabContent(tabs,tabNo){
    let tabContent;
    let display;
    tabContent = tabs.map((tab,i)=>{
      display = (tabNo === i+1)? "":"none";
      return(
        <div className="selected-tab-content" style={{display:display}}>
          <div className="content-title">
            {tab.title} <img src={tab.desIcon}/>
          </div>
          <div className="display-value">
            {this.formatNumber(tab.number)}
          </div>
          <p>{tab.description}</p>
        </div>
      )
    })
    return tabContent;
  }


  renderCol16() {
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      let data = this.state.dataJSON.data,
        bg_image = data.cover_image,
        title = data.title,
        tabs = data.tabs,
        currTab = this.state.currentTab === '' ? this.selectTab() : this.state.currentTab;
        console.log(currTab, "currTab")
      return (
        <div id="protograph_div" className="protograph-col7-mode">
          <div className="col-16-cover-area">
            <div className="background-image">
              <img src={bg_image}/>
            </div>
            <div className="color-overlay">
              <div className="page-title">
                Data
              </div>
              {this.renderTabContent(data.tabs, currTab)}
              <div className="vertical-tabs">
                {this.renderTabs(data.tabs)}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      let data = this.state.dataJSON.data,
        bg_image = data.cover_image,
        title = data.title,
        tabs = data.tabs,
        currTab = this.state.currentTab === '' ? this.selectTab() : this.state.currentTab;
      return (
        <div id="protograph_div" className="protograph-col4-mode">
          <div className="col-4-cover-area">
            <div className="background-image">
              <img src={bg_image}/>
            </div>
            <div className="color-overlay">
              <div className="page-title">
                Data
              </div>
              {this.renderTabContent(data.tabs, currTab)}
              <div className="vertical-tabs">
                {this.renderTabs(data.tabs)}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'col16' :
        return this.renderCol16();
        break;
      case 'col4':
        return this.renderCol4();
        break;
    }
  }
}
