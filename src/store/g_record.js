import firebase from 'firebase/app'

export default {
    actions: {
        async createGRecord({dispatch, commit}, g_record) {
            try {
                const uid = await dispatch('getUserId');
                return await firebase.database().ref(`/user/${uid}/g_record`).push(g_record)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchGRecords({commit, dispatch}) {
            try {
                const uid = await dispatch('getUserId')
                const g_records = (await firebase.database().ref(`/user/${uid}/g_record`).once('value')).val() || {}
                return Object.keys(g_records).map(key => ({...g_records[key], id: key}))
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchGRecordById({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUserId')
                const g_record = (await firebase.database().ref(`/user/${uid}/g_record`).child(id).once('value')).val() || {}
                return {...g_record, id}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}
