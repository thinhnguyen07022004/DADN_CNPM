// import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Checkbox from "expo-checkbox";
// import { useState } from "react";
// import { APP_COLOR } from "@/utils/constant";
// import ShareButton from "@/components/button/share.button";

// const plots = Array.from({ length: 6 }, (_, i) => ({
//     id: i + 1,
//     label: `Plot 0${i + 1}`,
// }));

// const RemoteControl = () => {
//     const [selected, setSelected] = useState<number[]>([]);
//     const [waterValues, setWaterValues] = useState<Record<number, string>>({});

//     const handleSelect = (id: number) => {
//         setSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
//     };

//     const handleWaterChange = (id: number, value: string) => {
//         setWaterValues((prev) => ({ ...prev, [id]: value }));
//     };

//     const renderPlot = ({ item }: { item: typeof plots[0] }) => (
//         <View style={styles.plotContainer}>
//             <Text style={styles.plotLabel}>{item.label}</Text>
//             <View style={styles.plotContent}>
//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.waterLabel}>Water (liter)</Text>
//                     <View style={styles.pickerWrapper}>
//                         <Picker
//                             selectedValue={waterValues[item.id] || "5.0"}
//                             style={styles.picker}
//                             onValueChange={(value) => handleWaterChange(item.id, value)}
//                         >
//                             <Picker.Item label="5.0" value="5.0" />
//                             <Picker.Item label="10.0" value="10.0" />
//                             <Picker.Item label="15.0" value="15.0" />
//                         </Picker>
//                     </View>
//                 </View>

//                 <View style={styles.checkboxContainer}>
//                     <Checkbox
//                         value={selected.includes(item.id)}
//                         onValueChange={() => handleSelect(item.id)}
//                         color={selected.includes(item.id) ? "#00B050" : undefined}
//                     />
//                     <Text style={styles.selectText}>Select</Text>
//                 </View>
//             </View>
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.title}>Remote Control</Text>
//             <Text style={styles.subTitle}>Irrigation</Text>

//             <FlatList
//                 data={plots}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={renderPlot}
//                 contentContainerStyle={{ paddingBottom: 20 }}
//             />

//             <ShareButton
//                 title="Execute"
//                 onPress={() => alert("me")}
//                 textStyle={{
//                     textTransform: "uppercase",
//                     color: "#fff",
//                     fontWeight: "bold",
//                     fontSize: 16
//                 }}
//                 buttonStyle={{
//                     justifyContent: "center",
//                     borderRadius: 12,
//                     backgroundColor: APP_COLOR.GREEN,
//                     paddingVertical: 16,
//                     alignItems: "center"
//                 }}
//                 pressStyle={{ alignSelf: "stretch" }}
//             />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#fff", padding: 16 },
//     title: { fontSize: 20, fontWeight: "bold", color: APP_COLOR.GREEN, marginBottom: 4 },
//     subTitle: { fontSize: 14, color: "#555", marginBottom: 16 },
//     plotContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
//     plotLabel: { fontWeight: "bold", color: "#00B050", marginBottom: 8 },
//     plotContent: { flexDirection: "row", alignItems: "center" },
//     waterLabel: { color: "#555", marginBottom: 4 },
//     pickerWrapper: {
//         backgroundColor: "#FFA500",  // màu cam
//         borderRadius: 20,
//         paddingHorizontal: 12,
//         justifyContent: "center",
//         height: 40,
//         minWidth: 80,
//     },
//     picker: {
//         color: "#fff",
//         fontWeight: "bold",
//         height: 40,
//         width: '100%',
//     },
//     checkboxContainer: { alignItems: "center", marginLeft: 16 },
//     selectText: { marginTop: 8, fontSize: 12, color: "#555" },
//     executeBtn: { backgroundColor: "#00B050", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
//     executeText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
// });

// export default RemoteControl;



import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { APP_COLOR } from '@/utils/constant';

const plots = [
    { id: '1', name: 'Plot 01' },
    { id: '2', name: 'Plot 02' },
    { id: '3', name: 'Plot 03' },
    { id: '4', name: 'Plot 04' },
];

const RemoteControl = () => {
    const [selectedPlots, setSelectedPlots] = useState<string[]>([]);
    const [waterValues, setWaterValues] = useState<Record<string, string>>({});

    const handleSelectPlot = (plotId: string) => {
        setSelectedPlots((prev) =>
            prev.includes(plotId) ? prev.filter((id) => id !== plotId) : [...prev, plotId]
        );
    };

    const handleWaterChange = (plotId: string, value: string) => {
        setWaterValues((prev) => ({ ...prev, [plotId]: value }));
    };

    const renderItem = ({ item }: { item: typeof plots[0] }) => (
        <View style={styles.plotBox}>
            <Text style={styles.plotTitle}>{item.name}</Text>
            <View style={styles.controlRow}>
                <Text style={styles.label}>Water (liter)</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={waterValues[item.id] || '5.0'}
                        onValueChange={(value) => handleWaterChange(item.id, value)}
                        style={styles.picker}
                        dropdownIconColor={APP_COLOR.ORANGE}
                    >
                        {['1.0', '2.0', '3.0', '4.0', '5.0', '6.0'].map((val) => (
                            <Picker.Item key={val} label={val} value={val} />
                        ))}
                    </Picker>
                </View>
                <CheckBox
                    checked={selectedPlots.includes(item.id)}
                    onPress={() => handleSelectPlot(item.id)}
                    checkedColor={APP_COLOR.GREEN}
                    uncheckedColor="#ccc"
                    containerStyle={styles.checkbox}
                />
                <Text style={styles.selectText}>Select</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Remote Control</Text>
            <Text style={styles.subHeader}>Irrigation</Text>

            <FlatList
                data={plots}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity style={styles.executeBtn}>
                <Text style={styles.executeText}>Execute</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    subHeader: { fontSize: 16, color: '#777', marginBottom: 16 },
    plotBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    plotTitle: { fontWeight: 'bold', fontSize: 16, color: APP_COLOR.GREEN, marginBottom: 12 },
    controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    label: { fontSize: 14, color: '#333' },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: APP_COLOR.ORANGE,
        borderRadius: 20,
        overflow: 'hidden',
        width: 100,
        height: 36,
        justifyContent: 'center',
    },
    picker: { height: 36, color: APP_COLOR.ORANGE, fontSize: 14 },
    checkbox: {
        padding: 0,
        margin: 0,
        backgroundColor: 'transparent',
    },
    selectText: { color: '#555', fontSize: 14 },
    executeBtn: {
        backgroundColor: APP_COLOR.GREEN,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    executeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    list: { paddingBottom: 20 },
});

export default RemoteControl;
