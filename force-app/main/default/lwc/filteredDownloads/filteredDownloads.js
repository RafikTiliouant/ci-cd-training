import { LightningElement, track, wire } from 'lwc';
import getFilteredDownloads from '@salesforce/apex/DCE_DownloadController.getFilteredDownloads';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import PRODUCT_FIELD from '@salesforce/schema/Downloads__c.Product__c';
import COUNTRY_FIELD from '@salesforce/schema/Downloads__c.Download_Country__c';
import LANGUAGE_FIELD from '@salesforce/schema/Downloads__c.Download_Language__c';

export default class DownloadFilter extends LightningElement {
    @track downloads = []; // Stores the records to display
    @track productOptions = []; // Picklist options for Product
    @track countryOptions = []; // Picklist options for Country
    @track languageOptions = []; // Picklist options for Language
    @track filters = { product: '', country: '', language: '' }; // Selected filter values

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Product', fieldName: 'Product__c' },
        { label: 'Country', fieldName: 'Download_Country__c' },
        { label: 'Language', fieldName: 'Download_Language__c' },
    ];

    // Fetch filtered downloads
    fetchDownloads() {
        getFilteredDownloads({
            product: this.filters.product,
            country: this.filters.country,
            language: this.filters.language
        })
            .then((result) => {
                this.downloads = result; // Update the displayed records
            })
            .catch((error) => {
                console.error('Error fetching downloads:', error);
            });
    }

    // Handle filter changes
    handleFilterChange(event) {
        const { name, value } = event.target; // Get filter name and value
        this.filters = { ...this.filters, [name]: value }; // Update filters dynamically
        this.fetchDownloads(); // Fetch updated list view
    }


    @wire(getObjectInfo, { objectApiName: 'Downloads__c' })
    objectInfo;

    // Fetch Product picklist values
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: PRODUCT_FIELD })
    wiredProductValues({ error, data }) {
        if (data) {
            this.productOptions = data.values.map((item) => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            console.error('Error fetching Product picklist values:', error);
        }
    }

    // Fetch Country picklist values
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: COUNTRY_FIELD })
    wiredCountryValues({ error, data }) {
        if (data) {
            this.countryOptions = data.values.map((item) => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            console.error('Error fetching Country picklist values:', error);
        }
    }

    // Fetch Language picklist values
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId',fieldApiName: LANGUAGE_FIELD })
    wiredLanguageValues({ error, data }) {
        if (data) {
            this.languageOptions = data.values.map((item) => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            console.error('Error fetching Language picklist values:', error);
        }
    }

    // Lifecycle hook to fetch initial data
    connectedCallback() {
        this.fetchDownloads(); // Fetch all downloads initially
    }
}
