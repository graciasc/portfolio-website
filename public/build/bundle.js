
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.38.2 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div30;
    	let div3;
    	let i0;
    	let t0;
    	let div0;
    	let label;
    	let i1;
    	let t1;
    	let input;
    	let t2;
    	let div1;
    	let nav;
    	let ul;
    	let li0;
    	let t4;
    	let li1;
    	let t6;
    	let div2;
    	let button0;
    	let t8;
    	let button1;
    	let t10;
    	let div5;
    	let div4;
    	let p0;
    	let t11;
    	let span;
    	let t13;
    	let h10;
    	let t15;
    	let p1;
    	let t17;
    	let button2;
    	let t19;
    	let i2;
    	let t20;
    	let div6;
    	let i3;
    	let t21;
    	let div7;
    	let t22;
    	let h11;
    	let t23;
    	let div10;
    	let div8;
    	let h12;
    	let t25;
    	let p2;
    	let t27;
    	let button3;
    	let t28;
    	let div9;
    	let img0;
    	let img0_src_value;
    	let t29;
    	let div13;
    	let div11;
    	let h13;
    	let t31;
    	let p3;
    	let t33;
    	let button4;
    	let t34;
    	let div12;
    	let img1;
    	let img1_src_value;
    	let t35;
    	let div16;
    	let div14;
    	let h14;
    	let t37;
    	let p4;
    	let t39;
    	let button5;
    	let t40;
    	let div15;
    	let img2;
    	let img2_src_value;
    	let t41;
    	let div19;
    	let div17;
    	let h15;
    	let t43;
    	let p5;
    	let t45;
    	let button6;
    	let t46;
    	let div18;
    	let img3;
    	let img3_src_value;
    	let t47;
    	let div22;
    	let div20;
    	let h16;
    	let t49;
    	let p6;
    	let t51;
    	let button7;
    	let t52;
    	let div21;
    	let img4;
    	let img4_src_value;
    	let t53;
    	let div25;
    	let div23;
    	let h17;
    	let t55;
    	let p7;
    	let t57;
    	let button8;
    	let t58;
    	let div24;
    	let img5;
    	let img5_src_value;
    	let t59;
    	let div29;
    	let div26;
    	let h18;
    	let t61;
    	let p8;
    	let t63;
    	let p9;
    	let t65;
    	let div27;
    	let h19;
    	let t67;
    	let p10;
    	let t69;
    	let p11;
    	let t71;
    	let div28;
    	let h110;
    	let t73;
    	let p12;
    	let t75;
    	let p13;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div30 = element("div");
    			div3 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div0 = element("div");
    			label = element("label");
    			i1 = element("i");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div1 = element("div");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "About";
    			t4 = space();
    			li1 = element("li");
    			li1.textContent = "Resume";
    			t6 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "About";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Resume";
    			t10 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p0 = element("p");
    			t11 = text("Hi I am ");
    			span = element("span");
    			span.textContent = "Gracias Claude";
    			t13 = space();
    			h10 = element("h1");
    			h10.textContent = "I'll Help You Build Your Dream";
    			t15 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t17 = space();
    			button2 = element("button");
    			button2.textContent = "Connect with me";
    			t19 = space();
    			i2 = element("i");
    			t20 = space();
    			div6 = element("div");
    			i3 = element("i");
    			t21 = space();
    			div7 = element("div");
    			t22 = space();
    			h11 = element("h1");
    			t23 = space();
    			div10 = element("div");
    			div8 = element("div");
    			h12 = element("h1");
    			h12.textContent = "The projects I've Worked on...";
    			t25 = space();
    			p2 = element("p");
    			p2.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t27 = space();
    			button3 = element("button");
    			t28 = space();
    			div9 = element("div");
    			img0 = element("img");
    			t29 = space();
    			div13 = element("div");
    			div11 = element("div");
    			h13 = element("h1");
    			h13.textContent = "The projects I've Worked on...";
    			t31 = space();
    			p3 = element("p");
    			p3.textContent = "Ipsum is simply dummy text of the printing and typesettings industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t33 = space();
    			button4 = element("button");
    			t34 = space();
    			div12 = element("div");
    			img1 = element("img");
    			t35 = space();
    			div16 = element("div");
    			div14 = element("div");
    			h14 = element("h1");
    			h14.textContent = "The projects I've Worked on...";
    			t37 = space();
    			p4 = element("p");
    			p4.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t39 = space();
    			button5 = element("button");
    			t40 = space();
    			div15 = element("div");
    			img2 = element("img");
    			t41 = space();
    			div19 = element("div");
    			div17 = element("div");
    			h15 = element("h1");
    			h15.textContent = "The projects I've Worked on...";
    			t43 = space();
    			p5 = element("p");
    			p5.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t45 = space();
    			button6 = element("button");
    			t46 = space();
    			div18 = element("div");
    			img3 = element("img");
    			t47 = space();
    			div22 = element("div");
    			div20 = element("div");
    			h16 = element("h1");
    			h16.textContent = "The projects I've Worked on...";
    			t49 = space();
    			p6 = element("p");
    			p6.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t51 = space();
    			button7 = element("button");
    			t52 = space();
    			div21 = element("div");
    			img4 = element("img");
    			t53 = space();
    			div25 = element("div");
    			div23 = element("div");
    			h17 = element("h1");
    			h17.textContent = "The projects I've Worked on...";
    			t55 = space();
    			p7 = element("p");
    			p7.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t57 = space();
    			button8 = element("button");
    			t58 = space();
    			div24 = element("div");
    			img5 = element("img");
    			t59 = space();
    			div29 = element("div");
    			div26 = element("div");
    			h18 = element("h1");
    			h18.textContent = "Contact";
    			t61 = space();
    			p8 = element("p");
    			p8.textContent = "Ipsum";
    			t63 = space();
    			p9 = element("p");
    			p9.textContent = "Ipsum";
    			t65 = space();
    			div27 = element("div");
    			h19 = element("h1");
    			h19.textContent = "About";
    			t67 = space();
    			p10 = element("p");
    			p10.textContent = "Ipsum";
    			t69 = space();
    			p11 = element("p");
    			p11.textContent = "Ipsum";
    			t71 = space();
    			div28 = element("div");
    			h110 = element("h1");
    			h110.textContent = "Check us out";
    			t73 = space();
    			p12 = element("p");
    			p12.textContent = "Ipsum";
    			t75 = space();
    			p13 = element("p");
    			p13.textContent = "Ipsum";
    			attr_dev(i0, "class", "fa fa-fire fa-lg");
    			add_location(i0, file, 8, 4, 167);
    			attr_dev(i1, "class", "fa fa-bars fa-lg cursor-pointer");
    			attr_dev(i1, "id", "bars");
    			add_location(i1, file, 10, 28, 287);
    			attr_dev(label, "for", "menu-toggle");
    			add_location(label, file, 10, 3, 262);
    			attr_dev(div0, "class", "inline lg:hidden float-right mt-1 ml-2 r");
    			add_location(div0, file, 9, 4, 204);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "menu-toggle");
    			attr_dev(input, "class", "float-right mt-4 hidden");
    			add_location(input, file, 12, 4, 369);
    			attr_dev(li0, "class", "");
    			add_location(li0, file, 16, 4, 539);
    			attr_dev(li1, "class", "");
    			add_location(li1, file, 17, 4, 567);
    			add_location(ul, file, 15, 5, 530);
    			attr_dev(nav, "class", "cursor-pointer");
    			attr_dev(nav, "id", "nav");
    			add_location(nav, file, 14, 3, 487);
    			attr_dev(div1, "class", "pt-3 hidden");
    			attr_dev(div1, "id", "menu");
    			add_location(div1, file, 13, 4, 448);
    			attr_dev(button0, "class", "px-2 border-transparent border-b-2 hover:border-teal-600 focus:outline-none outline-none");
    			add_location(button0, file, 22, 3, 677);
    			attr_dev(button1, "class", "px-2 border-transparent border-b-2 hover:border-teal-600 focus:outline-none outline-none");
    			add_location(button1, file, 23, 3, 800);
    			attr_dev(div2, "class", "lg:inline lg:float-right hidden");
    			add_location(div2, file, 21, 4, 628);
    			attr_dev(div3, "class", "lg:px-6 py-2 px-4 border-b-2 border-gray-600");
    			add_location(div3, file, 7, 2, 104);
    			attr_dev(span, "class", "text-red-600");
    			add_location(span, file, 30, 33, 1091);
    			attr_dev(p0, "class", "text-p-hue");
    			add_location(p0, file, 30, 3, 1061);
    			attr_dev(h10, "class", "text-h-hue lg:text-3xl text-4xl font-extrabold");
    			add_location(h10, file, 31, 3, 1149);
    			attr_dev(p1, "class", "text-p-hue");
    			add_location(p1, file, 32, 3, 1247);
    			attr_dev(button2, "class", "mt-4 border-b-2 font-bold border-teal-600 focus:outline-none hover:shadow-sm");
    			add_location(button2, file, 33, 3, 1428);
    			attr_dev(i2, "class", "fa fa-long-arrow-right animate-pulse text-gray-600");
    			add_location(i2, file, 33, 121, 1546);
    			attr_dev(div4, "class", " m-6 lg:m-12 text-center lg:w-1/2");
    			add_location(div4, file, 29, 4, 1010);
    			attr_dev(div5, "class", "flex justify-center pt-24");
    			add_location(div5, file, 28, 2, 966);
    			attr_dev(i3, "class", "fa fa-angle-double-down animate-bounce fa-2x text-gray-600");
    			add_location(i3, file, 40, 4, 1909);
    			attr_dev(div6, "class", "flex justify-center mt-12 lg:mt-20");
    			add_location(div6, file, 39, 2, 1856);
    			attr_dev(div7, "class", "border-b-2 border-gray-700 pt-6 lg:p-24");
    			add_location(div7, file, 43, 2, 2000);
    			attr_dev(h11, "id", "demo");
    			add_location(h11, file, 46, 2, 2093);
    			attr_dev(h12, "class", "text-h-hue text-4xl font-bold leading-9 pt-4");
    			add_location(h12, file, 49, 3, 2232);
    			attr_dev(p2, "class", "text-p-hue text-lg pt-6");
    			add_location(p2, file, 50, 3, 2328);
    			add_location(button3, file, 51, 3, 2516);
    			attr_dev(div8, "class", "w-1/2 p-6");
    			add_location(div8, file, 48, 4, 2205);
    			attr_dev(img0, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img0.src !== (img0_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 54, 3, 2586);
    			attr_dev(div9, "class", "w-1/2 relative p-24");
    			add_location(div9, file, 53, 4, 2549);
    			attr_dev(div10, "class", "lg:flex justify-center m-5 lg:m-24 bg-main relative hidden");
    			attr_dev(div10, "id", "section");
    			add_location(div10, file, 47, 2, 2115);
    			attr_dev(h13, "class", "text-h-hue text-4xl font-bold leading-9 pt-4");
    			add_location(h13, file, 60, 3, 2935);
    			attr_dev(p3, "class", "text-p-hue text-xl pt-6");
    			add_location(p3, file, 61, 3, 3031);
    			add_location(button4, file, 62, 3, 3220);
    			attr_dev(div11, "class", "w-1/2 p-6");
    			add_location(div11, file, 59, 4, 2908);
    			attr_dev(img1, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img1.src !== (img1_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 65, 3, 3290);
    			attr_dev(div12, "class", "w-1/2 relative p-24");
    			add_location(div12, file, 64, 4, 3253);
    			attr_dev(div13, "class", "lg:flex lg:justify-center m-5 lg:m-24 bg-main hidden relative");
    			attr_dev(div13, "id", "section2");
    			add_location(div13, file, 58, 2, 2814);
    			attr_dev(h14, "class", "text-h-hue text-4xl font-bold leading-9 pt-4");
    			add_location(h14, file, 71, 3, 3639);
    			attr_dev(p4, "class", "text-p-hue text-xl pt-6");
    			add_location(p4, file, 72, 3, 3735);
    			add_location(button5, file, 73, 3, 3923);
    			attr_dev(div14, "class", "w-1/2 p-6");
    			add_location(div14, file, 70, 4, 3612);
    			attr_dev(img2, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img2.src !== (img2_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 76, 3, 3993);
    			attr_dev(div15, "class", "w-1/2 relative p-24");
    			add_location(div15, file, 75, 4, 3956);
    			attr_dev(div16, "class", "lg:flex lg:justify-center hidden m-5 lg:m-24 bg-main relative");
    			attr_dev(div16, "id", "section3");
    			add_location(div16, file, 69, 2, 3518);
    			attr_dev(h15, "class", "text-h-hue text-2xl font-bold leading-9 pt-4");
    			add_location(h15, file, 83, 3, 4315);
    			attr_dev(p5, "class", "text-p-hue pt-2");
    			add_location(p5, file, 84, 3, 4411);
    			add_location(button6, file, 85, 3, 4591);
    			attr_dev(div17, "class", "pl-6");
    			add_location(div17, file, 82, 4, 4293);
    			attr_dev(img3, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img3.src !== (img3_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 88, 3, 4659);
    			attr_dev(div18, "class", "relative h-48 m-5");
    			add_location(div18, file, 87, 4, 4624);
    			attr_dev(div19, "class", "bg-main relative lg:hidden");
    			add_location(div19, file, 81, 2, 4248);
    			attr_dev(h16, "class", "text-h-hue text-2xl font-bold leading-9 pt-4");
    			add_location(h16, file, 94, 3, 4954);
    			attr_dev(p6, "class", "text-p-hue pt-2");
    			add_location(p6, file, 95, 3, 5050);
    			add_location(button7, file, 96, 3, 5230);
    			attr_dev(div20, "class", "pl-6");
    			add_location(div20, file, 93, 4, 4932);
    			attr_dev(img4, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img4.src !== (img4_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 99, 3, 5298);
    			attr_dev(div21, "class", "relative h-48 m-5");
    			add_location(div21, file, 98, 4, 5263);
    			attr_dev(div22, "class", "bg-main relative lg:hidden");
    			add_location(div22, file, 92, 2, 4887);
    			attr_dev(h17, "class", "text-h-hue text-2xl font-bold leading-9 pt-4");
    			add_location(h17, file, 105, 3, 5593);
    			attr_dev(p7, "class", "text-p-hue pt-2");
    			add_location(p7, file, 106, 3, 5689);
    			add_location(button8, file, 107, 3, 5869);
    			attr_dev(div23, "class", "pl-6");
    			add_location(div23, file, 104, 4, 5571);
    			attr_dev(img5, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img5.src !== (img5_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file, 110, 3, 5937);
    			attr_dev(div24, "class", "relative h-48 m-5");
    			add_location(div24, file, 109, 4, 5902);
    			attr_dev(div25, "class", "bg-main relative lg:hidden");
    			add_location(div25, file, 103, 2, 5526);
    			attr_dev(h18, "class", "font-bold");
    			add_location(h18, file, 118, 3, 6310);
    			add_location(p8, file, 119, 3, 6348);
    			add_location(p9, file, 120, 3, 6364);
    			add_location(div26, file, 117, 4, 6301);
    			attr_dev(h19, "class", "font-bold");
    			add_location(h19, file, 123, 3, 6401);
    			add_location(p10, file, 124, 3, 6437);
    			add_location(p11, file, 125, 3, 6453);
    			add_location(div27, file, 122, 4, 6392);
    			attr_dev(h110, "class", "font-bold");
    			add_location(h110, file, 128, 3, 6490);
    			add_location(p12, file, 129, 3, 6533);
    			add_location(p13, file, 130, 3, 6549);
    			add_location(div28, file, 127, 4, 6481);
    			attr_dev(div29, "class", "sticky flex justify-between bg-secondary-hue w-full text-center border-t border-grey p-4 pin-b");
    			add_location(div29, file, 116, 2, 6188);
    			attr_dev(div30, "class", "bg-hue h-full font-mono");
    			add_location(div30, file, 5, 1, 46);
    			add_location(main, file, 4, 0, 38);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div30);
    			append_dev(div30, div3);
    			append_dev(div3, i0);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div0, label);
    			append_dev(label, i1);
    			append_dev(div3, t1);
    			append_dev(div3, input);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t8);
    			append_dev(div2, button1);
    			append_dev(div30, t10);
    			append_dev(div30, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p0);
    			append_dev(p0, t11);
    			append_dev(p0, span);
    			append_dev(div4, t13);
    			append_dev(div4, h10);
    			append_dev(div4, t15);
    			append_dev(div4, p1);
    			append_dev(div4, t17);
    			append_dev(div4, button2);
    			append_dev(div4, t19);
    			append_dev(div4, i2);
    			append_dev(div30, t20);
    			append_dev(div30, div6);
    			append_dev(div6, i3);
    			append_dev(div30, t21);
    			append_dev(div30, div7);
    			append_dev(div30, t22);
    			append_dev(div30, h11);
    			append_dev(div30, t23);
    			append_dev(div30, div10);
    			append_dev(div10, div8);
    			append_dev(div8, h12);
    			append_dev(div8, t25);
    			append_dev(div8, p2);
    			append_dev(div8, t27);
    			append_dev(div8, button3);
    			append_dev(div10, t28);
    			append_dev(div10, div9);
    			append_dev(div9, img0);
    			append_dev(div30, t29);
    			append_dev(div30, div13);
    			append_dev(div13, div11);
    			append_dev(div11, h13);
    			append_dev(div11, t31);
    			append_dev(div11, p3);
    			append_dev(div11, t33);
    			append_dev(div11, button4);
    			append_dev(div13, t34);
    			append_dev(div13, div12);
    			append_dev(div12, img1);
    			append_dev(div30, t35);
    			append_dev(div30, div16);
    			append_dev(div16, div14);
    			append_dev(div14, h14);
    			append_dev(div14, t37);
    			append_dev(div14, p4);
    			append_dev(div14, t39);
    			append_dev(div14, button5);
    			append_dev(div16, t40);
    			append_dev(div16, div15);
    			append_dev(div15, img2);
    			append_dev(div30, t41);
    			append_dev(div30, div19);
    			append_dev(div19, div17);
    			append_dev(div17, h15);
    			append_dev(div17, t43);
    			append_dev(div17, p5);
    			append_dev(div17, t45);
    			append_dev(div17, button6);
    			append_dev(div19, t46);
    			append_dev(div19, div18);
    			append_dev(div18, img3);
    			append_dev(div30, t47);
    			append_dev(div30, div22);
    			append_dev(div22, div20);
    			append_dev(div20, h16);
    			append_dev(div20, t49);
    			append_dev(div20, p6);
    			append_dev(div20, t51);
    			append_dev(div20, button7);
    			append_dev(div22, t52);
    			append_dev(div22, div21);
    			append_dev(div21, img4);
    			append_dev(div30, t53);
    			append_dev(div30, div25);
    			append_dev(div25, div23);
    			append_dev(div23, h17);
    			append_dev(div23, t55);
    			append_dev(div23, p7);
    			append_dev(div23, t57);
    			append_dev(div23, button8);
    			append_dev(div25, t58);
    			append_dev(div25, div24);
    			append_dev(div24, img5);
    			append_dev(div30, t59);
    			append_dev(div30, div29);
    			append_dev(div29, div26);
    			append_dev(div26, h18);
    			append_dev(div26, t61);
    			append_dev(div26, p8);
    			append_dev(div26, t63);
    			append_dev(div26, p9);
    			append_dev(div29, t65);
    			append_dev(div29, div27);
    			append_dev(div27, h19);
    			append_dev(div27, t67);
    			append_dev(div27, p10);
    			append_dev(div27, t69);
    			append_dev(div27, p11);
    			append_dev(div29, t71);
    			append_dev(div29, div28);
    			append_dev(div28, h110);
    			append_dev(div28, t73);
    			append_dev(div28, p12);
    			append_dev(div28, t75);
    			append_dev(div28, p13);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { name } = $$props;
    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
