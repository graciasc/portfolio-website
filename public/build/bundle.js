
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
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
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

    /* src/components/Nav.svelte generated by Svelte v3.38.2 */

    const file$1 = "src/components/Nav.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let link;
    	let t0;
    	let style;
    	let t2;
    	let div5;
    	let div4;
    	let div1;
    	let img;
    	let img_src_value;
    	let t3;
    	let div0;
    	let nav;
    	let ul;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let div2;
    	let label;
    	let i;
    	let t8;
    	let input;
    	let t9;
    	let div3;
    	let button0;
    	let t11;
    	let button1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			link = element("link");
    			t0 = space();
    			style = element("style");
    			style.textContent = "#menu-toggle:checked + #menu {\n  display:block;\n}";
    			t2 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t3 = space();
    			div0 = element("div");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "About";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "Resume";
    			t7 = space();
    			div2 = element("div");
    			label = element("label");
    			i = element("i");
    			t8 = space();
    			input = element("input");
    			t9 = space();
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "About";
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Resume";
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    			add_location(link, file$1, 1, 4, 11);
    			add_location(style, file$1, 2, 0, 127);
    			attr_dev(img, "width", "50px");
    			attr_dev(img, "height", "50px");
    			if (img.src !== (img_src_value = "https://logos-download.com/wp-content/uploads/2016/11/EA_logo_black.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 10, 6, 335);
    			attr_dev(li0, "class", "border-transparent border-b-2 hover:border-gray-600");
    			add_location(li0, file$1, 15, 12, 618);
    			attr_dev(li1, "class", "border-transparent border-b-2 hover:border-gray-600");
    			add_location(li1, file$1, 16, 12, 705);
    			add_location(ul, file$1, 14, 10, 601);
    			attr_dev(nav, "class", "cursor-pointer");
    			add_location(nav, file$1, 13, 8, 562);
    			attr_dev(div0, "class", "pt-3 hidden");
    			attr_dev(div0, "id", "menu");
    			add_location(div0, file$1, 12, 6, 518);
    			add_location(div1, file$1, 9, 4, 323);
    			attr_dev(i, "class", "fa fa-bars fa-lg cursor-pointer");
    			add_location(i, file$1, 22, 31, 912);
    			attr_dev(label, "for", "menu-toggle");
    			add_location(label, file$1, 22, 6, 887);
    			attr_dev(div2, "class", "inline lg:hidden mt-1 ml-2");
    			add_location(div2, file$1, 21, 4, 840);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "menu-toggle");
    			attr_dev(input, "class", "mt-4 hidden");
    			add_location(input, file$1, 24, 4, 984);
    			attr_dev(button0, "class", "px-2 border-transparent border-b-2 hover:border-teal-600 focus:outline-none outline-none");
    			add_location(button0, file$1, 27, 6, 1104);
    			attr_dev(button1, "class", "px-2 border-transparent border-b-2 hover:border-teal-600 focus:outline-none outline-none");
    			add_location(button1, file$1, 28, 6, 1230);
    			attr_dev(div3, "class", "lg:inline lg:float-right hidden");
    			add_location(div3, file$1, 26, 4, 1052);
    			attr_dev(div4, "class", "lg:px-6 py-2 my-2 px-4 border-b-2 border-gray-600 flex justify-between");
    			add_location(div4, file$1, 8, 2, 234);
    			attr_dev(div5, "class", "flex-1");
    			add_location(div5, file$1, 6, 0, 193);
    			add_location(main, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, link);
    			append_dev(main, t0);
    			append_dev(main, style);
    			append_dev(main, t2);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, label);
    			append_dev(label, i);
    			append_dev(div4, t8);
    			append_dev(div4, input);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t11);
    			append_dev(div3, button1);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div26;
    	let nav;
    	let t0;
    	let div1;
    	let div0;
    	let p0;
    	let t1;
    	let span;
    	let t3;
    	let h10;
    	let t5;
    	let p1;
    	let t7;
    	let button0;
    	let t9;
    	let i0;
    	let t10;
    	let div2;
    	let i1;
    	let t11;
    	let div3;
    	let t12;
    	let h11;
    	let t13;
    	let div6;
    	let div4;
    	let h12;
    	let t15;
    	let p2;
    	let t17;
    	let button1;
    	let t18;
    	let div5;
    	let img0;
    	let img0_src_value;
    	let t19;
    	let div9;
    	let div7;
    	let h13;
    	let t21;
    	let p3;
    	let t23;
    	let button2;
    	let t24;
    	let div8;
    	let img1;
    	let img1_src_value;
    	let t25;
    	let div12;
    	let div10;
    	let h14;
    	let t27;
    	let p4;
    	let t29;
    	let button3;
    	let t30;
    	let div11;
    	let img2;
    	let img2_src_value;
    	let t31;
    	let div15;
    	let div13;
    	let h15;
    	let t33;
    	let p5;
    	let t35;
    	let button4;
    	let t36;
    	let div14;
    	let img3;
    	let img3_src_value;
    	let t37;
    	let div18;
    	let div16;
    	let h16;
    	let t39;
    	let p6;
    	let t41;
    	let button5;
    	let t42;
    	let div17;
    	let img4;
    	let img4_src_value;
    	let t43;
    	let div21;
    	let div19;
    	let h17;
    	let t45;
    	let p7;
    	let t47;
    	let button6;
    	let t48;
    	let div20;
    	let img5;
    	let img5_src_value;
    	let t49;
    	let div25;
    	let div22;
    	let h18;
    	let t51;
    	let p8;
    	let t53;
    	let p9;
    	let t55;
    	let div23;
    	let h19;
    	let t57;
    	let p10;
    	let t59;
    	let p11;
    	let t61;
    	let div24;
    	let h110;
    	let t63;
    	let p12;
    	let t65;
    	let p13;
    	let current;
    	nav = new Nav({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div26 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t1 = text("Hi I am ");
    			span = element("span");
    			span.textContent = "Gracias Claude";
    			t3 = space();
    			h10 = element("h1");
    			h10.textContent = "I'll Help You Build Your Dream";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t7 = space();
    			button0 = element("button");
    			button0.textContent = "Connect with me";
    			t9 = space();
    			i0 = element("i");
    			t10 = space();
    			div2 = element("div");
    			i1 = element("i");
    			t11 = space();
    			div3 = element("div");
    			t12 = space();
    			h11 = element("h1");
    			t13 = space();
    			div6 = element("div");
    			div4 = element("div");
    			h12 = element("h1");
    			h12.textContent = "The projects I've Worked on...";
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t17 = space();
    			button1 = element("button");
    			t18 = space();
    			div5 = element("div");
    			img0 = element("img");
    			t19 = space();
    			div9 = element("div");
    			div7 = element("div");
    			h13 = element("h1");
    			h13.textContent = "The projects I've Worked on...";
    			t21 = space();
    			p3 = element("p");
    			p3.textContent = "Ipsum is simply dummy text of the printing and typesettings industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t23 = space();
    			button2 = element("button");
    			t24 = space();
    			div8 = element("div");
    			img1 = element("img");
    			t25 = space();
    			div12 = element("div");
    			div10 = element("div");
    			h14 = element("h1");
    			h14.textContent = "The projects I've Worked on...";
    			t27 = space();
    			p4 = element("p");
    			p4.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t29 = space();
    			button3 = element("button");
    			t30 = space();
    			div11 = element("div");
    			img2 = element("img");
    			t31 = space();
    			div15 = element("div");
    			div13 = element("div");
    			h15 = element("h1");
    			h15.textContent = "The projects I've Worked on...";
    			t33 = space();
    			p5 = element("p");
    			p5.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t35 = space();
    			button4 = element("button");
    			t36 = space();
    			div14 = element("div");
    			img3 = element("img");
    			t37 = space();
    			div18 = element("div");
    			div16 = element("div");
    			h16 = element("h1");
    			h16.textContent = "The projects I've Worked on...";
    			t39 = space();
    			p6 = element("p");
    			p6.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t41 = space();
    			button5 = element("button");
    			t42 = space();
    			div17 = element("div");
    			img4 = element("img");
    			t43 = space();
    			div21 = element("div");
    			div19 = element("div");
    			h17 = element("h1");
    			h17.textContent = "The projects I've Worked on...";
    			t45 = space();
    			p7 = element("p");
    			p7.textContent = "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
    			t47 = space();
    			button6 = element("button");
    			t48 = space();
    			div20 = element("div");
    			img5 = element("img");
    			t49 = space();
    			div25 = element("div");
    			div22 = element("div");
    			h18 = element("h1");
    			h18.textContent = "Contact";
    			t51 = space();
    			p8 = element("p");
    			p8.textContent = "Ipsum";
    			t53 = space();
    			p9 = element("p");
    			p9.textContent = "Ipsum";
    			t55 = space();
    			div23 = element("div");
    			h19 = element("h1");
    			h19.textContent = "About";
    			t57 = space();
    			p10 = element("p");
    			p10.textContent = "Ipsum";
    			t59 = space();
    			p11 = element("p");
    			p11.textContent = "Ipsum";
    			t61 = space();
    			div24 = element("div");
    			h110 = element("h1");
    			h110.textContent = "Check us out";
    			t63 = space();
    			p12 = element("p");
    			p12.textContent = "Ipsum";
    			t65 = space();
    			p13 = element("p");
    			p13.textContent = "Ipsum";
    			attr_dev(span, "class", "text-red-600");
    			add_location(span, file, 15, 33, 301);
    			attr_dev(p0, "class", "text-p-hue");
    			add_location(p0, file, 15, 3, 271);
    			attr_dev(h10, "class", "text-h-hue lg:text-3xl text-4xl font-extrabold");
    			add_location(h10, file, 16, 3, 359);
    			attr_dev(p1, "class", "text-p-hue");
    			add_location(p1, file, 17, 3, 457);
    			attr_dev(button0, "class", "");
    			add_location(button0, file, 18, 3, 638);
    			attr_dev(i0, "class", "fa fa-long-arrow-right animate-pulse text-gray-600");
    			add_location(i0, file, 18, 45, 680);
    			attr_dev(div0, "class", " m-6 lg:m-12 text-center lg:w-1/2");
    			add_location(div0, file, 14, 4, 220);
    			attr_dev(div1, "class", "flex justify-center pt-24");
    			add_location(div1, file, 13, 2, 176);
    			attr_dev(i1, "class", "fa fa-angle-double-down animate-bounce fa-2x text-gray-600");
    			add_location(i1, file, 25, 4, 1043);
    			attr_dev(div2, "class", "flex justify-center mt-12 lg:mt-20");
    			add_location(div2, file, 24, 2, 990);
    			attr_dev(div3, "class", "border-b-2 border-gray-700 pt-6 lg:p-24");
    			add_location(div3, file, 28, 2, 1134);
    			attr_dev(h11, "id", "demo");
    			add_location(h11, file, 31, 2, 1227);
    			attr_dev(h12, "class", "text-h-hue text-4xl font-bold leading-9 pt-4");
    			add_location(h12, file, 34, 3, 1366);
    			attr_dev(p2, "class", "text-p-hue text-lg pt-6");
    			add_location(p2, file, 35, 3, 1462);
    			add_location(button1, file, 36, 3, 1650);
    			attr_dev(div4, "class", "w-1/2 p-6");
    			add_location(div4, file, 33, 4, 1339);
    			attr_dev(img0, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img0.src !== (img0_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 39, 3, 1720);
    			attr_dev(div5, "class", "w-1/2 relative p-24");
    			add_location(div5, file, 38, 4, 1683);
    			attr_dev(div6, "class", "lg:flex justify-center m-5 lg:m-24 bg-main relative hidden");
    			attr_dev(div6, "id", "section");
    			add_location(div6, file, 32, 2, 1249);
    			attr_dev(h13, "class", "text-h-hue text-4xl font-bold leading-9 pt-4");
    			add_location(h13, file, 45, 3, 2069);
    			attr_dev(p3, "class", "text-p-hue text-xl pt-6");
    			add_location(p3, file, 46, 3, 2165);
    			add_location(button2, file, 47, 3, 2354);
    			attr_dev(div7, "class", "w-1/2 p-6");
    			add_location(div7, file, 44, 4, 2042);
    			attr_dev(img1, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img1.src !== (img1_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 50, 3, 2424);
    			attr_dev(div8, "class", "w-1/2 relative p-24");
    			add_location(div8, file, 49, 4, 2387);
    			attr_dev(div9, "class", "lg:flex lg:justify-center m-5 lg:m-24 bg-main hidden relative");
    			attr_dev(div9, "id", "section2");
    			add_location(div9, file, 43, 2, 1948);
    			attr_dev(h14, "class", "text-h-hue text-4xl font-bold leading-9 pt-4");
    			add_location(h14, file, 56, 3, 2773);
    			attr_dev(p4, "class", "text-p-hue text-xl pt-6");
    			add_location(p4, file, 57, 3, 2869);
    			add_location(button3, file, 58, 3, 3057);
    			attr_dev(div10, "class", "w-1/2 p-6");
    			add_location(div10, file, 55, 4, 2746);
    			attr_dev(img2, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img2.src !== (img2_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 61, 3, 3127);
    			attr_dev(div11, "class", "w-1/2 relative p-24");
    			add_location(div11, file, 60, 4, 3090);
    			attr_dev(div12, "class", "lg:flex lg:justify-center hidden m-5 lg:m-24 bg-main relative");
    			attr_dev(div12, "id", "section3");
    			add_location(div12, file, 54, 2, 2652);
    			attr_dev(h15, "class", "text-h-hue text-2xl font-bold leading-9 pt-4");
    			add_location(h15, file, 68, 3, 3449);
    			attr_dev(p5, "class", "text-p-hue pt-2");
    			add_location(p5, file, 69, 3, 3545);
    			add_location(button4, file, 70, 3, 3725);
    			attr_dev(div13, "class", "pl-6");
    			add_location(div13, file, 67, 4, 3427);
    			attr_dev(img3, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img3.src !== (img3_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 73, 3, 3793);
    			attr_dev(div14, "class", "relative h-48 m-5");
    			add_location(div14, file, 72, 4, 3758);
    			attr_dev(div15, "class", "bg-main relative lg:hidden");
    			add_location(div15, file, 66, 2, 3382);
    			attr_dev(h16, "class", "text-h-hue text-2xl font-bold leading-9 pt-4");
    			add_location(h16, file, 79, 3, 4088);
    			attr_dev(p6, "class", "text-p-hue pt-2");
    			add_location(p6, file, 80, 3, 4184);
    			add_location(button5, file, 81, 3, 4364);
    			attr_dev(div16, "class", "pl-6");
    			add_location(div16, file, 78, 4, 4066);
    			attr_dev(img4, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img4.src !== (img4_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 84, 3, 4432);
    			attr_dev(div17, "class", "relative h-48 m-5");
    			add_location(div17, file, 83, 4, 4397);
    			attr_dev(div18, "class", "bg-main relative lg:hidden");
    			add_location(div18, file, 77, 2, 4021);
    			attr_dev(h17, "class", "text-h-hue text-2xl font-bold leading-9 pt-4");
    			add_location(h17, file, 90, 3, 4727);
    			attr_dev(p7, "class", "text-p-hue pt-2");
    			add_location(p7, file, 91, 3, 4823);
    			add_location(button6, file, 92, 3, 5003);
    			attr_dev(div19, "class", "pl-6");
    			add_location(div19, file, 89, 4, 4705);
    			attr_dev(img5, "class", "absolute inset-0 w-full h-full object-cover object-center");
    			if (img5.src !== (img5_src_value = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file, 95, 3, 5071);
    			attr_dev(div20, "class", "relative h-48 m-5");
    			add_location(div20, file, 94, 4, 5036);
    			attr_dev(div21, "class", "bg-main relative lg:hidden");
    			add_location(div21, file, 88, 2, 4660);
    			attr_dev(h18, "class", "font-bold");
    			add_location(h18, file, 103, 3, 5444);
    			add_location(p8, file, 104, 3, 5482);
    			add_location(p9, file, 105, 3, 5498);
    			add_location(div22, file, 102, 4, 5435);
    			attr_dev(h19, "class", "font-bold");
    			add_location(h19, file, 108, 3, 5535);
    			add_location(p10, file, 109, 3, 5571);
    			add_location(p11, file, 110, 3, 5587);
    			add_location(div23, file, 107, 4, 5526);
    			attr_dev(h110, "class", "font-bold");
    			add_location(h110, file, 113, 3, 5624);
    			add_location(p12, file, 114, 3, 5667);
    			add_location(p13, file, 115, 3, 5683);
    			add_location(div24, file, 112, 4, 5615);
    			attr_dev(div25, "class", "sticky flex justify-between bg-secondary-hue w-full text-center border-t border-grey p-4 pin-b");
    			add_location(div25, file, 101, 2, 5322);
    			attr_dev(div26, "class", "h-full font-mono");
    			add_location(div26, file, 8, 1, 92);
    			add_location(main, file, 7, 0, 84);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div26);
    			mount_component(nav, div26, null);
    			append_dev(div26, t0);
    			append_dev(div26, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t1);
    			append_dev(p0, span);
    			append_dev(div0, t3);
    			append_dev(div0, h10);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(div0, t7);
    			append_dev(div0, button0);
    			append_dev(div0, t9);
    			append_dev(div0, i0);
    			append_dev(div26, t10);
    			append_dev(div26, div2);
    			append_dev(div2, i1);
    			append_dev(div26, t11);
    			append_dev(div26, div3);
    			append_dev(div26, t12);
    			append_dev(div26, h11);
    			append_dev(div26, t13);
    			append_dev(div26, div6);
    			append_dev(div6, div4);
    			append_dev(div4, h12);
    			append_dev(div4, t15);
    			append_dev(div4, p2);
    			append_dev(div4, t17);
    			append_dev(div4, button1);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			append_dev(div5, img0);
    			append_dev(div26, t19);
    			append_dev(div26, div9);
    			append_dev(div9, div7);
    			append_dev(div7, h13);
    			append_dev(div7, t21);
    			append_dev(div7, p3);
    			append_dev(div7, t23);
    			append_dev(div7, button2);
    			append_dev(div9, t24);
    			append_dev(div9, div8);
    			append_dev(div8, img1);
    			append_dev(div26, t25);
    			append_dev(div26, div12);
    			append_dev(div12, div10);
    			append_dev(div10, h14);
    			append_dev(div10, t27);
    			append_dev(div10, p4);
    			append_dev(div10, t29);
    			append_dev(div10, button3);
    			append_dev(div12, t30);
    			append_dev(div12, div11);
    			append_dev(div11, img2);
    			append_dev(div26, t31);
    			append_dev(div26, div15);
    			append_dev(div15, div13);
    			append_dev(div13, h15);
    			append_dev(div13, t33);
    			append_dev(div13, p5);
    			append_dev(div13, t35);
    			append_dev(div13, button4);
    			append_dev(div15, t36);
    			append_dev(div15, div14);
    			append_dev(div14, img3);
    			append_dev(div26, t37);
    			append_dev(div26, div18);
    			append_dev(div18, div16);
    			append_dev(div16, h16);
    			append_dev(div16, t39);
    			append_dev(div16, p6);
    			append_dev(div16, t41);
    			append_dev(div16, button5);
    			append_dev(div18, t42);
    			append_dev(div18, div17);
    			append_dev(div17, img4);
    			append_dev(div26, t43);
    			append_dev(div26, div21);
    			append_dev(div21, div19);
    			append_dev(div19, h17);
    			append_dev(div19, t45);
    			append_dev(div19, p7);
    			append_dev(div19, t47);
    			append_dev(div19, button6);
    			append_dev(div21, t48);
    			append_dev(div21, div20);
    			append_dev(div20, img5);
    			append_dev(div26, t49);
    			append_dev(div26, div25);
    			append_dev(div25, div22);
    			append_dev(div22, h18);
    			append_dev(div22, t51);
    			append_dev(div22, p8);
    			append_dev(div22, t53);
    			append_dev(div22, p9);
    			append_dev(div25, t55);
    			append_dev(div25, div23);
    			append_dev(div23, h19);
    			append_dev(div23, t57);
    			append_dev(div23, p10);
    			append_dev(div23, t59);
    			append_dev(div23, p11);
    			append_dev(div25, t61);
    			append_dev(div25, div24);
    			append_dev(div24, h110);
    			append_dev(div24, t63);
    			append_dev(div24, p12);
    			append_dev(div24, t65);
    			append_dev(div24, p13);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
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

    	$$self.$capture_state = () => ({ Nav, name });

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
