import React, { useState} from 'react';
import { Button,TextInput, Form, Select, SelectItem, Loading } from 'carbon-components-react';
import H from "@here/maps-api-for-javascript";
import 'here-js-api/styles/mapsjs-ui.css';
const apikey = process.env.REACT_APP_APIKEY;

function Mapf1(){

  const [fromcoord,setfromcoord] = useState('');
  const [tocoord,settocoord] = useState('');
  const [isLoading,setLoading] = useState(false);


    
  const modes = [
  {
    id: 'car',
    value: 'Drive a Car',
  },
  {
    id: 'pedestrian',
    value: 'Let me Walk',
  },
    {
    id: 'pubtransport',
    value: 'Use Public Transport',
  },
];


 const [modequery, setmodequery] = useState(modes[0].id);
 const [mapdisplay,setmapdisplay] = useState('');


 const handleModeChange = (event) => {
    setmodequery(event.target.value);
    //console.log("modechange: ",event.target.value );
  }
  
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

      if (fromcoord && tocoord) {

        const mapsv = () => {

        try{

          if(modequery === "pubtransport"){

function calculateRouteFromAtoB (platform) {
  var router = platform.getPublicTransitService(),
      routeRequestParams = {
        origin: fromcoord,
        destination: tocoord,
        return: 'polyline,actions,travelSummary'
      };


  router.getRoutes(
    routeRequestParams,
    onSuccess,
    onError
  );
}

function onSuccess(result) {
  var route = result.routes[0];
  addRouteShapeToMap(route);
  addManueversToMap(route);
  addManueversToPanel(route);
  addSummaryToPanel(route);
}

function onError(error) {
  document.getElementById('map').innerHTML = "";
  document.getElementById('panel').innerHTML = "";
  alert('Can\'t reach the remote server');
}

document.getElementById('map').innerHTML = "";
document.getElementById('panel').innerHTML = "";

var mapContainer = document.getElementById('map');
var routeInstructionsContainer = document.getElementById('panel');

var platform = new H.service.Platform({
  apikey: apikey
});
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map,{
  center: {lat:52.5160, lng:13.3779},
  zoom: 13,
  pixelRatio: window.devicePixelRatio || 1
});

window.addEventListener('resize', () => map.getViewPort().resize());

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

var ui = H.ui.UI.createDefault(map, defaultLayers);

var bubble;

function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

function addRouteShapeToMap(route){

  try{
  var group = new H.map.Group();
  route.sections.forEach(function(section) {
    group.addObject(
      new H.map.Polyline(
        H.geo.LineString.fromFlexiblePolyline(section.polyline), {
          style: {
            lineWidth: 4,
            strokeColor: 'rgba(0, 128, 255, 0.7)'
          }
        }
      )
    );
  });

  map.addObject(group);
  map.getViewModel().setLookAtData({
    bounds: group.getBoundingBox()
  });
  }
catch(err){
  document.getElementById('map').innerHTML = "";
  alert('Results Unavailable');

}
}

function addManueversToMap(route){
  try{
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new  H.map.Group(),
    i;

    route.sections.forEach((section) => {
      let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
    
      let actions = section.actions;
      if (actions) {
        for (i = 0;  i < actions.length; i += 1) {
          let action = actions[i];
          var marker =  new H.map.Marker({
            lat: poly[action.offset * 3],
            lng: poly[action.offset * 3 + 1]},
            {icon: dotIcon});
          marker.instruction = action.instruction;
          group.addObject(marker);
        }
      }
    });

    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(
        evt.target.getGeometry(), evt.target.instruction);
    }, false);
  
    map.addObject(group);
    }
catch(err){
  console.log("Error: Map info/Transit info unavailable");
}
}


function addSummaryToPanel(route){
  try{
  let duration = 0,
      distance = 0;

  route.sections.forEach((section) => {
    distance += section.travelSummary.length;
    duration += section.travelSummary.duration;
  });

  var summaryDiv = document.createElement('div'),
   content = '';
   content += '<b>Total distance</b>: ' + distance  + 'm. <br/>';
   content += '<b>Travel Time</b>: ' + duration.toMMSS();


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft ='5%';
  summaryDiv.style.marginRight ='5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}
catch(err){
  document.getElementById('panel').innerHTML = "";
  console.log("pubtransport err");
}
}

function addManueversToPanel(route){
  try{
  var nodeOL = document.createElement('ol');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

  route.sections.forEach((section) => {
    if (section.actions) {
      section.actions.forEach((action, idx) => {
        var li = document.createElement('li'),
            spanArrow = document.createElement('span'),
            spanInstruction = document.createElement('span');

        spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
        spanInstruction.innerHTML = section.actions[idx].instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);

        nodeOL.appendChild(li);
      });
    }
  });
  routeInstructionsContainer.appendChild(nodeOL);
}
catch(err){
  document.getElementById('panel').innerHTML = "";
  console.log("pubtransport err");
}
}


  Number.prototype.toMMSS = function () {
    return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
  }


calculateRouteFromAtoB (platform);

          }

          else{
function calculateRouteFromAtoB(platform) {
  var router = platform.getRoutingService(null, 8),
      routeRequestParams = {
        routingMode: 'fast',
        transportMode: modequery,
        origin: fromcoord,
        destination: tocoord,
        return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
      };

  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

function onSuccess(result) {
  var route = result.routes[0];

  addRouteShapeToMap(route);
  addManueversToMap(route);
  addWaypointsToPanel(route);
  addManueversToPanel(route);
  addSummaryToPanel(route);
}


function onError(error) {
  
  document.getElementById('map').innerHTML = "";
  document.getElementById('panel').innerHTML = "";
  alert('Can\'t reach the remote server');
}

document.getElementById('map').innerHTML = "";
document.getElementById('panel').innerHTML = "";

var mapContainer = document.getElementById('map')
var routeInstructionsContainer = document.getElementById('panel');


var platform = new H.service.Platform({
  apikey: apikey
});

var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map, {
  center: {lat: 52.5160, lng: 13.3779},
  zoom: 13,
  pixelRatio: window.devicePixelRatio || 1
});

window.addEventListener('resize', () => map.getViewPort().resize());

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  var bubble;

function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

function addRouteShapeToMap(route) {
  route.sections.forEach((section) => {
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    let polyline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });

    map.addObject(polyline);
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
  });
}


function addManueversToMap(route) {


  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1" />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new H.map.Group(),
    i,
    j;

  try{
  route.sections.forEach((section) => {
    let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();

    let actions = section.actions;
    for (i = 0; i < actions.length; i += 1) {
      let action = actions[i];
      var marker = new H.map.Marker({
        lat: poly[action.offset * 3],
        lng: poly[action.offset * 3 + 1]},
        {icon: dotIcon});
      marker.instruction = action.instruction;
      group.addObject(marker);
    }

    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(evt.target.getGeometry(), evt.target.instruction);
    }, false);

    map.addObject(group);
  });
}
catch(err){
  console.log("Error: Map info/Transit info unavailable");
}
}


function addWaypointsToPanel(route) {

  try{
  var nodeH3 = document.createElement('h3'),
    labels = [];

  route.sections.forEach((section) => {
    labels.push(
      section.turnByTurnActions[0].nextRoad.name[0].value)
    labels.push(
      section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value)
  });

  nodeH3.textContent = labels.join(' - ');
  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
  }
catch(err){
  document.getElementById('panel').innerHTML = "";
  // alert('Results Unavailable');
  //console.log("pedestrian call");
}
}

function addSummaryToPanel(route) {

  let duration = 0,
    distance = 0;

  route.sections.forEach((section) => {
    distance += section.travelSummary.length;
    duration += section.travelSummary.duration;
  });

  var summaryDiv = document.createElement('div'),
    content = '<b>Total distance</b>: ' + distance + 'm. <br />' +
      '<b>Travel Time</b>: ' + toMMSS(duration) + ' (in current traffic)';

  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft = '5%';
  summaryDiv.style.marginRight = '5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);

}


function addManueversToPanel(route) {
  var nodeOL = document.createElement('ol');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

  route.sections.forEach((section) => {
    section.actions.forEach((action, idx) => {
      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
      spanInstruction.innerHTML = section.actions[idx].instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    });
  });

  routeInstructionsContainer.appendChild(nodeOL);
}

function toMMSS(duration) {
  return Math.floor(duration / 60) + ' minutes ' + (duration % 60) + ' seconds.';
}


calculateRouteFromAtoB(platform);
        }

        }
        catch(error){
            console.log(error);
             alert('Server cannot be reached')
        }

        }
        mapsv();
      setfromcoord('');
      settocoord('');
      setmapdisplay('Route');
      }
      else {
      //console.log('empty values');
        alert('From and To Co-ordinates are empty');
        setLoading(false);
      }
    };
            
    return(
      <>
        
        <Form onSubmit={handleSubmit}>

            <TextInput id={'fromcoord'} labelText = {'From'} placeholder = {'From Co-ordinates'} size = 'lg' value={fromcoord} onChange={(e) => setfromcoord(e.target.value)} />
            <br/>
            <TextInput id={'tocoord'} labelText = {'To'} placeholder = {'To Co-ordinates'} size = 'lg' value={tocoord} onChange={(e) => settocoord(e.target.value)} />
            <br/>
              <Select labelText="Mode of Transport" value={modequery} onChange={handleModeChange}>
                    {modes.map((item, i) => (
                    <SelectItem value={item.id} key={i} text = {item.value} />
                    ))}
              </Select>
              
             <div className="ButtonAreamap">
                <Button type="submit"> Get my Route </Button>
             </div>

        </Form>
              <Loading active = {isLoading} description="Active loading indicator" withOverlay={true}/>

<br/>

              { mapdisplay &&
              <div id = "route-display">
                <br/>
                <br/>
                <div id = 'map' ></div>
                <br/>
                <div id = 'panel' ></div>
              </div>}
                
            </>
            );
};

export default Mapf1;


// 28.63409,77.21693

// 18.50423,73.85286

// c-good,ped-error,pub-unavailable


// 52.5160,13.3779
// 52.5206,13.3862
// // c-good,ped-good