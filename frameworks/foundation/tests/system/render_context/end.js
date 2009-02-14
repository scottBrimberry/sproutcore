// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple, Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok */

var context = null;

module("SC.RenderContext#end", {
  setup: function() {
    context = SC.RenderContext();
  }
});

test("should replace opening tag with string and add closing tag, leaving middle content in place", function() {
  context.push("line1").end();
  equals(context.get(0), "<div>", "opening tag");
  equals(context.get(1), "line1", "opening tag");
  equals(context.get(2), "</div>", "closing tag");
});

test("should emit any CSS class names included in the tag opts.classNames array", function() {
  context.classNames("foo bar".w()).end();
  ok(context.get(0).match(/class=\"foo bar\"/), '<div> has class attr') ;
});

test("should emit id in tag opts.id", function() {
  context.id("foo").end();
  ok(context.get(0).match(/id=\"foo\"/), "<div> has id attr");
});

test("should emit style in tag if opts.styles is defined", function() {
  context.styles({ alpha: "beta", foo: "bar" }).end();
  ok(context.get(0).match(/style=\"alpha: beta; foo: bar\"/), '<div> has style="alpha: beta; foo: bar"');
});


test("should write arbitrary attrs has in opts", function() {
  context.attr({ foo: "bar", bar: "baz" }).end();
  ok(context.get(0).match(/foo=\"bar\"/), 'has foo="bar"');
  ok(context.get(0).match(/bar=\"baz\"/), 'has bar="baz"');
});

test("classNames should override attrs.class", function() {
  context.classNames("foo".w()).attr({ "class": "bar" }).end();
  ok(context.get(0).match(/class=\"foo\"/), 'has class="foo"');
});

test("opts.id should override opts.attrs.id", function() {
  context.id("foo").attr({ id: "bar" }).end();
  ok(context.get(0).match(/id=\"foo\"/), 'has id="foo"');
});

test("opts.styles should override opts.attrs.style", function() {
  context.styles({ foo: "foo" }).attr({ style: "bar: bar" }).end();
  ok(context.get(0).match(/style=\"foo: foo\"/), 'has style="foo: foo"');
});

test("should return receiver if receiver has no prevObject", function() {
  ok(!context.prevObject, 'precondition - prevObject is null');
  equals(context.end(), context, 'ends as self');
});

test("should return prevObject if receiver has prevObject", function() {
  var c2 = context.begin();
  equals(c2.end(), context, "should return prevObject");
});

test("emits self closing tag if tag has no content and c._selfClosing !== NO", function() {
  context.end();
  equals(context.get(0), "<div />");
});

test("emits two tags even if tag has no content if opts.selfClosing == NO", function() {
  context._selfClosing = NO;
  
  context.end();
  equals(context.length, 2, "has two lines");
  equals(context.get(0), "<div>", "has opening tag");
  equals(context.get(1), "</div>", "has closing tag");
});

test("does NOT emit self closing tag if it has content, even if opts.selfClosing == YES (because that would yield invalid HTML)", function() {
  context._selfClosing = YES;
  context.push("line").end();
  equals(context.length, 3, "has 3 lines");
  equals(context.get(2), "</div>", "has closing tag");
});

test("it should make sure to clear reused temporary attributes object", function() {
  
  // generate one tag...
  context.begin()
    .id("foo")
    .styles({ foo: "bar" })
    .classNames("foo bar".w())
    .push("line")
  .end(); 
  
  // generate second tag...will reuse internal temporary attrs object.
  context.begin().id("bar").end();
  var str = context.get(context.length-1);
  equals(str, "<div id=\"bar\"  />");
});

