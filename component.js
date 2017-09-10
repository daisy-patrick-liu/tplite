/**
 * copyright @Lloyd Zhou(lloydzhou@qq.com)
 */
(function(exports){

    exports.Component = function(root, tmpl, state, callbacks){
        var template = new tplite.Template();
        var compile = template(tmpl);
        var componet = {
          state: state, render: render, setState: setState, trigger: trigger
        };
        function trigger (name){
          var args = [].slice.call(arguments, 1)
          return !callbacks[name] || (typeof callbacks[name] == 'function' && callbacks[name].apply(componet, args))
        }
        function setState (newState){
          state = Object.assign({}, state||{}, newState||{});
          var shouldUpdate = callbacks['shouldUpdate'];
          var update = callbacks['update'];
          if (trigger('shouldUpdate')){
            render()
            requestAnimationFrame(function(){
              trigger('update')
            })
          }
          return state;
        }
        function render (){
          var out = new tplite.StringBuffer()
          compile(state, out);
          if (root){
            return root.innerHTML = out.toString();
          }
          return out.toString()
        }
        setState({
          callback: function(name) {
            var cbname = Math.random().toString().replace('0.', '__')
            var args = [].slice.call(arguments, 1)
            exports[cbname] = function(e){
              return typeof callbacks[name] == 'function' && callbacks[name].apply(componet, args.concat(e))
            }
            return 'tplite.' + cbname + '(event)'
          }
        })
        trigger('init')
        return componet;
    }

}(typeof exports === 'undefined' ? this.tplite || (this.tplite = {}) : exports));
