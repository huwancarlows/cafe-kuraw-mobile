// AdminStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        flexDirection: 'row',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    refreshButton: {
        flexDirection: 'justice',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    calendarContainer: {
        backgroundColor: '#222',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    dateText: {
        color: '#000',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    saveButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: '#666',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sidebar: {
        width: width * 0.2,
        backgroundColor: '#1a1a1a',
        paddingTop: 40,
        paddingHorizontal: 10,
    },
    sidebarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    sidebarButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    sidebarTitle: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    
holidayListContainer: {
    flex: 1,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    maxHeight: 200, // Limit height to avoid overflow
    overflow: 'hidden',
},

holidayListScroll: {
    flexGrow: 0, // Prevent excessive growth
},

holidayListTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},

listTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},

holidayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
},

holidayText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
},

holidayDate: {
    color: '#FFD700',
    fontSize: 14,
},


});

export default styles;
