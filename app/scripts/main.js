"use strict";
var hostnames=[],
  ips= [],
  prevHostnames = [],
  prevIps = [];
function getAns(context, question, type){
  var url,
    res;
  if (type === "A"){
    url = "http://api.statdns.com/" + question + "/a";
  }
  else if (type === "PTR") {
    var inAddr = question.split(".").reverse().join(".") + ".in-addr.arpa";

    url = "http://api.statdns.com/" + inAddr + "/ptr";
  }
  $.ajax({
        url: url,
        dataType: "jsonp",
        success: function(response){

          res = response.answer.reduce(function(prev, cur){
            if (cur.type === type){
              return prev + cur.rdata.slice(0,cur.rdata.length - 1) +  "\n";
            }
            else {
              return prev;
            }
          }, "");
          
          context.text(res);
    
          
        },
        error: function(){
          context.text(type + " record not found");     
          context.addClass("red");   
       }
    });


}

function parseHostnames(text){
  var pattern,
    matches;
  //pattern = /\b(\w+\.)+(ca|com)\b/g;
  pattern = /\b(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?\b/ig;
  matches = text.match(pattern);
  return matches || [];
  
}
function parseIPs(text){
  var pattern,
    matches;
  pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  matches = text.match(pattern);
  return matches || [];

}
function addRow(table, first, second) {
  var template,
    tr;
  template = "<tr><td class='col-md-6'>" + first + "</td><td class='col-md-6'>"+ second + "</td></tr>";
  tr = $(template).appendTo(table);
  return tr;
}

function reset() {
  $("#query").val("");
  $(".hostnameTable").hide();
  $(".ipTable").hide();
  $(".hostnameTable").html("<tr><th>A Records</th><th></th></tr>");
  $(".ipTable").html("<tr><th>PTR Records</th><th></th></tr>");
  ips = [];
  hostnames = [];
  prevIps = [];
  prevHostnames = [];
}

$("#query").on("input", function(){
  var text,

    ipDiff,
    hostnameDiff,
    tr,
    td;
  var self = $("#query");
    var hostnameTable = $(".hostnameTable");
  var ipTable = $(".ipTable");

  var pattern = /^\s*$/;
  if (self.val().match(pattern)){

    reset();
  } 
  else {
    prevHostnames = _.clone(hostnames);
    prevIps = _.clone(ips);
    text = $("#query").val();
    hostnames = parseHostnames(text);
    ips = parseIPs(text);
    ipDiff = _.difference(ips, prevIps);
    hostnameDiff = _.difference(hostnames, prevHostnames);

    if (hostnameDiff.length > 0){
      hostnameDiff.forEach(function(hostname){
        tr = addRow(hostnameTable, hostname, "<i class='fa fa-spinner fa-spin'></i>");
        td= tr.children().eq(1);
        getAns(td, hostname, "A");
      });
      hostnameTable.show();
      $(".startover").show();
    }
    if (ipDiff.length > 0){
      ipDiff.forEach(function(ip){
        tr = addRow(ipTable, ip, "<i class='fa fa-spinner fa-spin'></i>");
        td= tr.children().eq(1);
        getAns(td, ip, "PTR");
      });
      ipTable.show();
      $(".startover").show();

    }

  }
});

 //var text2 = "msn.ca ubc.ca\namazon.ca it.ubc.ca 137.82.1.2\n8.8.8.8";
// var a = [1,2,3,4]
// var b = _.clone(a);
 //$("#query").val(text2);
