import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native"

const styles = StyleSheet.create({
    todo: {
        fontSize: 30,
        backgroundColor: "pink",
        marginBottom: 20,
        padding: 15,
    },
})

interface IProps {
    todoList: ITodo[];
    deleteTodo: (V: number) => void;
}

const ListTodo = (props: IProps) => {

    const { todoList } = props
    const { deleteTodo } = props

    const handleDeleteTodo = (id: number) => {
        deleteTodo(id)
    }
    return (
        <>
            <FlatList style={{ marginTop: 20, borderColor: "red", borderWidth: 1 }}
                data={todoList}
                keyExtractor={item => item.id + ""}
                // object destructuring data.item
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => handleDeleteTodo(item.id)}>
                            <Text
                                // key={item.id} 
                                style={styles.todo}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </>
    )
}

export default ListTodo