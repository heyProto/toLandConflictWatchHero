import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


export default class toCard extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      currentTab:1
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
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
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }

      axios.all(items_to_fetch).then(axios.spread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON:{},
          siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs,
          currentTab:1
        };
        this.setState(stateVar);
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  selectTab(tab){
    this.setState({
      currentTab:tab
    });
  }

  renderTabs(tabs){
    let tabNames;
    let tabClass;
    tabNames = tabs.map((tab,i)=>{
      tabClass = (i+1 === this.state.currentTab)? "single-tab active":"single-tab";
      return(
        <a key={i.toString()} className="tab-links" onClick={()=>this.selectTab(i+1)}>
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
    let data = this.state.dataJSON.data;
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      let bg_image = data.cover_image;
      let title = data.title;
      let tabs = data.tabs;
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
              {this.renderTabContent(data.tabs,this.state.currentTab)}
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
        tabs = data.tabs;
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
              {this.renderTabContent(data.tabs,this.state.currentTab)}
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
