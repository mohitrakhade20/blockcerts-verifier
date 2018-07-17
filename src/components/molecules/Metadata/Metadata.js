import { html, LitElement } from '@polymer/lit-element';
import getValueFrom from '../../../helpers/getValueFrom';
import CSS from './_components.metadata-css';
import CloseButton from '../../atoms/CloseButton';

function getProperties (metadataList) {
  return metadataList.schema.properties.certificate.properties;
}

class Metadata extends LitElement {
  constructor () {
    super();
    this.isOpen = false;
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  static get properties () {
    return {
      isOpen: Boolean,
      metadataList: Object,
      showMetadata: Boolean
    };
  }

  toggleOpen () {
    this.isOpen = !this.isOpen;
  }

  _render ({ metadataList, showMetadata }) {
    if (!showMetadata) {
      return null;
    }

    if (!metadataList) {
      return null;
    }

    // TODO: better handle this dynamic class (cf npm classnames)
    const panelClasses = [
      'buv-o-overlay',
      'buv-c-metadata-container',
      'buv-u-slide-from-right',
      this.isOpen ? 'is-active' : ''
    ].join(' ');

    const properties = getProperties(metadataList);

    const innerHTML = metadataList.displayOrder.map(entry => {
      const key = entry.split('.')[1]; // get key name
      const title = properties[key].title;
      const value = getValueFrom(metadataList, entry);

      return html`
        <dt class='buv-c-metadata-list__title'>${title}</dt>
        <dd class='buv-c-metadata-list__detail'>${value}</dd>
      `;
    });

    return html`
      ${CSS}
      <button onclick='${this.toggleOpen}' class='buv-c-metadata-link  buv-o-button-link'>
        <label class='buv-u-visually-hidden'>Open list of metadata</label>
      </button>
      <section class$='${panelClasses}'>
        <h1 class='buv-c-metadata-container__title'>Certificate Metadata</h1>
        ${CloseButton({
    onClick: this.toggleOpen,
    className: 'buv-c-metadata-container__close-button'
  })}
        <dl class='buv-c-metadata-list  buv-o-small-text'>${innerHTML}</dl>
      </section>
    `;
  }
}

window.customElements.define('buv-metadata-raw', Metadata);

function MetadataWrapper (props) {
  return html`
    <buv-metadata-raw
      metadataList='${props.metadataList}'
      showMetadata='${props.showMetadata}'
    ></buv-metadata-raw>`;
}

export {
  MetadataWrapper as Metadata
};
