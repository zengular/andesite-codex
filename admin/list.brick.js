import {Brick}              from "zengular";
import twig                 from "./list.twig";
import "./list.less";
import {Ajax}               from "zengular-util";
import pluginManager        from "../plugin/plugin-manager";
import ListPreprocessPlugin from "../plugin/types/ListPreprocessPlugin";

@Brick.register('codex-admin-list', twig)
@Brick.renderOnConstruct(false)
export default class CodexAdminList extends Brick {

	onInitialize() {
	}

	beforeRender(args) {
		this.page = 1;
		this.sort = {field: null, dir: 'asc'};

		this.fields = args.fields;
		this.pageSize = args.pageSize;
		this.idField = args.idField;
		this.urlBase = args.urlBase;
		this.plugins = args.plugins;

		this.fields.forEach(field => {
			if (field.visible && field.sortable && this.sort.field === null) this.sort.field = field.name;
		});
	}

	createViewModel() {
		return {
			fields: this.fields
		};
	}

	onRender() {

		this.$$('list').listen('click', event => {
			this.fire('ITEM-SELECTED', {id: event.target.closest('tr').dataset.id});
		});


		this.$$('pager-slider').listen('input', event => {
			let page = event.target.value;
			this.fire('PAGING-CHANGED', {page: page, pageSize: this.pageSize, count: this.count});
		});

		this.$$('pager-slider').listen('change', event => this.load(event.target.value));

		this.$$('step-page-right').listen('click', event =>
			this.$$('pager-slider', slider => {
				slider.value++;
				this.load(slider.value);
			})
		);

		this.$$('step-page-left').listen('click', event =>
			this.$$('pager-slider', slider => {
				slider.value--;
				this.load(slider.value);
			})
		);


		this.$$('sortable').listen('click', event => {
			if (this.loading) return;
			if (this.sort.field === event.target.dataset.field) {
				this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
			} else {
				this.sort = {
					field: event.target.dataset.field,
					dir: 'asc'
				}
			}
			this.renderSortingIcons();
			this.load();
		});
		this.renderSortingIcons();
		this.load(this.page);
	}

	renderSortingIcons() {
		this.$$('sortable', elem => elem.classList.remove('sort-asc', 'sort-desc'));
		this.$$('sortable').filter(`[data-field=${this.sort.field}]`).each(elem => elem.classList.add('sort-' + this.sort.dir));
	}

	load(page = null) {

		if (page === null) page = this.page;
		if (this.loading) return;

		this.loading = true;
		this.fire('show-overlay');

		Ajax.json('/' + this.urlBase + '/get-list/' + page, {sort: this.sort.field ? this.sort : null}).getJson
			.then(request => {
				let response = request.response;
				this.page = parseInt(response.page);
				this.count = response.count;

				this.fire('PAGING-CHANGED', {page: this.page, pageSize: this.pageSize, count: this.count});

				let pages = Math.ceil(response.count / this.pageSize);
				if (pages === 1) this.$$('pager-container').node.style.display = 'none';
				this.$$('pager-slider').node.setAttribute('max', pages);
				this.$$('pager-slider').node.value = response.page;


				this.$$('step-page-left', stepper => {
					if (this.page === 1) stepper.classList.add('unavailable');
					else stepper.classList.remove('unavailable');
				});

				this.$$('step-page-right', stepper => {
					if (this.page === pages) stepper.classList.add('unavailable');
					else stepper.classList.remove('unavailable');
				});

				this.renderContent(response.rows);
				this.loading = false;
			})
			.finally(() => {
				this.fire('hide-overlay');
			});
	}

	renderContent(rows) {
		let plugins = pluginManager.get(this.plugins, ListPreprocessPlugin);
		let tbody = this.$$('list').node;
		tbody.innerHTML = '';
		rows.forEach(row => {
			let tr = document.createElement('tr');
			tr.dataset.id = row[this.idField];
			plugins.forEach(plugin => { plugin.preprocess(row);});
			this.fields.forEach(field => {
				if (field.visible) {
					let td = document.createElement('td');
					td.innerHTML = typeof row[field.name] !== 'undefined' ? row[field.name] : '-';
					tr.appendChild(td);
				}
			});
			tbody.appendChild(tr);
		});
	}

	reload(urlBase = null) { if (urlBase === null || this.urlBase === urlBase) this.load();}
	addNew() { this.fire('ADD-NEW-ITEM');}
}

