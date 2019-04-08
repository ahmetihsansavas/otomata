"use strict";
var tok     //current Token
var tokens  //Token.list()
const liste = Object.getOwnPropertyNames(Math);
const fliste = liste.filter(k=>Math[k].length==1);
function match(k) {
    if (tok.kind == k) 
        tok = tokens.pop();
    else expected(k);
}
function expected(s) {
    error(s+" expected -- "+tok+" found");
}
function error(s) {
    throw ("At index "+tok.index+": "+s);
}
function showError(elt) {
    elt.selectionStart = tok.index
    elt.selectionEnd = tok.index + tok.length
    elt.focus(); 
}

class Constant {
    constructor(num) { this.num = num; }
   fValue() { return this.num; }
   toTree() { return ' '+this.num+'\n'; }
   toPostfix() { return this.num+' '; }
   toString() { return this.num.toString(); }
   
}


class Binary {
   constructor(left, oper, right) {
      this.left = left; this.oper = oper; this.right = right;
   }
   fValue() {
      switch (this.oper) {
      case PLUS:  return this.left.fValue()+this.right.fValue();
      case MINUS: return this.left.fValue()-this.right.fValue();
      case STAR:  return this.left.fValue()*this.right.fValue();
      case POWER: return this.left.fValue()**this.right.fValue();
      case MOD : return this.left.fValue()%this.right.fValue();
      case IDENT : 
      case SLASH: 
         let v = this.right.fValue();
         if (v == 0) 
            throw ("Division by zero");
         return this.left.fValue()/v;
      default: return NaN;
      }
   }
   toTree() {
      return this.oper+'\n'+this.left.toTree()+' '+this.right.toTree()
   }
   toPostfix() {
      return this.left.toPostfix()+this.right.toPostfix()+this.oper+' '
   }
   toString() {
      return '('+this.left + this.oper + this.right+')'
   }
}

function ident(i,e){
   
   // e=binary(e);
    if (fliste.includes(i)&& e!=undefined) {       
        
           console.log(Math[i](e));
            
           return Math[i](e);
       
    }
  
}

function binary(e) {
    let op = tok.kind; match(op);
    return new Binary(e, op, term());
}
function expression() {
    let e = (tok.kind == MINUS)?
      binary(new Constant(0)) : term();
    while (tok.kind == PLUS || tok.kind == MINUS ||tok.kind == STAR || tok.kind == SLASH ) 
      e = binary(e);
    return e;
}
function term() {
    let e = factor();
    while (tok.kind == STAR || tok.kind == SLASH || tok.kind == MOD) {
        let op = tok.kind; match(op);
        e = new Binary(e, op, factor());
    }
    return e;
}
function factor() {
    switch (tok.kind)  {
    case NUMBER:
      let c = tok.val;
      match(NUMBER);
      return new Constant(c);
    case LEFT:
      match(LEFT); 
      let e = expression();
      match(RIGHT); 
      if (tok.kind==POWER) {
        match(POWER);
        e = new Binary(e,POWER,new Constant(tok.val));
        match(NUMBER);
      } 
      else{
          return e;
      }
      return e;
      case IDENT:
        if (fliste.includes(tok.val)) {
           let i = String(tok.val);
            match(IDENT); 
             
            match(LEFT); 
            let e = expression();
            //let e=binary(tok.val);
                //e= binary(e);
             console.log(e);
            if (e.constructor == Binary) {
                 e= e.fValue();
            }
                   
            match(RIGHT);            
           
            //e = new Binary();
            
            let b = ident(i,e);
            b=new Constant(b);
        return b;
        }
    
    default: expected("Factor");
    }
    return null;
}

