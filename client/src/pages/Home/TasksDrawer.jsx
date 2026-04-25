import {
	Box,
	Button,
	Checkbox,
	Chip,
	Divider,
	Drawer,
	Paper,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function TasksDrawer() {
	const { user } = useContext(AuthContext);
	const [open, setOpen] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [filter, setFilter] = useState("all");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [editingTaskId, setEditingTaskId] = useState(null);
	const [editingTitle, setEditingTitle] = useState("");
	const [editingCompleted, setEditingCompleted] = useState(false);

	const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

	const fetchTasks = useCallback(async () => {
		if (!user?.uid) {
			return;
		}

		setLoading(true);
		setError("");

		try {
			const query =
				filter === "all" ? "" : `?completed=${filter === "completed" ? "true" : "false"}`;
			const response = await fetch(`${API_BASE_URL}/api/tasks/${user.uid}${query}`);

			if (!response.ok) {
				throw new Error("Unable to load tasks.");
			}

			const data = await response.json();
			setTasks(data);
		} catch (requestError) {
			setError(requestError.message || "Unable to load tasks.");
		} finally {
			setLoading(false);
		}
	}, [filter, user?.uid]);

	useEffect(() => {
		if (open) {
			fetchTasks();
		}
	}, [open, fetchTasks]);

	useEffect(() => {
		if (!user) {
			setOpen(false);
		}
	}, [user]);

	const createTask = async () => {
		if (!user?.uid || !newTaskTitle.trim()) {
			setError("Task title is required.");
			return;
		}

		setSaving(true);
		setError("");

		try {
			const response = await fetch(`${API_BASE_URL}/api/tasks`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user.uid, title: newTaskTitle.trim() }),
			});

			if (!response.ok) {
				throw new Error("Unable to create task.");
			}

			setNewTaskTitle("");
			await fetchTasks();
		} catch (requestError) {
			setError(requestError.message || "Unable to create task.");
		} finally {
			setSaving(false);
		}
	};

	const saveTaskEdit = async () => {
		if (!user?.uid || !editingTaskId) {
			return;
		}

		if (!editingTitle.trim()) {
			setError("Task title cannot be empty.");
			return;
		}

		setSaving(true);
		setError("");

		try {
			const response = await fetch(`${API_BASE_URL}/api/tasks/${editingTaskId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user.uid,
					title: editingTitle.trim(),
					completed: editingCompleted,
				}),
			});

			if (!response.ok) {
				throw new Error("Unable to update task.");
			}

			setEditingTaskId(null);
			setEditingTitle("");
			await fetchTasks();
		} catch (requestError) {
			setError(requestError.message || "Unable to update task.");
		} finally {
			setSaving(false);
		}
	};

	const toggleTaskCompleted = async (taskId, completed) => {
		if (!user?.uid) {
			return;
		}

		setSaving(true);
		setError("");

		try {
			const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user.uid, completed }),
			});

			if (!response.ok) {
				throw new Error("Unable to update task status.");
			}

			await fetchTasks();
		} catch (requestError) {
			setError(requestError.message || "Unable to update task status.");
		} finally {
			setSaving(false);
		}
	};

	const deleteTask = async (taskId) => {
		if (!user?.uid) {
			return;
		}

		setSaving(true);
		setError("");

		try {
			const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user.uid }),
			});

			if (!response.ok) {
				throw new Error("Unable to delete task.");
			}

			await fetchTasks();
		} catch (requestError) {
			setError(requestError.message || "Unable to delete task.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box>
			<Button
				onClick={() => {
					setOpen(!open);
				}}
				variant="contained"
			>
				Tasks
			</Button>

			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				sx={{ "& .MuiDrawer-paper": { backgroundColor: "primary.main", color: "white" } }}
			>
				<Stack
					sx={{
						width: { xs: "100vw", sm: "80vw", md: "36vw" },
						minWidth: { md: 420 },
						justifyContent: "flex-start",
						alignItems: "stretch",
						padding: "20px",
						height: "100%",
					}}
					spacing={2}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="h5">Tasks</Typography>
						<Chip label={`${completedCount}/${tasks.length} complete`} size="small" />
					</Stack>
					<Divider color="white" sx={{ color: "white" }} />

					{!user ? (
						<Typography>Please sign in to manage tasks.</Typography>
					) : (
						<>
							<Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
								<TextField
									fullWidth
									label="New task"
									size="small"
									value={newTaskTitle}
									onChange={(event) => setNewTaskTitle(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === "Enter") {
											event.preventDefault();
											createTask();
										}
									}}
									disabled={saving}
									sx={{
										"& .MuiInputBase-input": { color: "white" },
										"& .MuiInputLabel-root": { color: "rgba(255,255,255,0.85)" },
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor: "rgba(255,255,255,0.5)",
										},
									}}
								/>
								<Button variant="contained" onClick={createTask} disabled={saving}>
									Add
								</Button>
							</Stack>

							<ToggleButtonGroup
								exclusive
								value={filter}
								onChange={(_, nextFilter) => {
									if (nextFilter) {
										setFilter(nextFilter);
									}
								}}
								size="small"
								sx={{
									"& .MuiToggleButton-root": {
										color: "white",
										borderColor: "rgba(255,255,255,0.45)",
									},
									"& .Mui-selected": {
										backgroundColor: "rgba(255,255,255,0.22)",
									},
								}}
							>
								<ToggleButton value="all">All</ToggleButton>
								<ToggleButton value="incomplete">Incomplete</ToggleButton>
								<ToggleButton value="completed">Completed</ToggleButton>
							</ToggleButtonGroup>

							{error ? <Typography color="error.light">{error}</Typography> : null}

							<Stack spacing={1.2} sx={{ overflowY: "auto", pr: 0.5 }}>
								{loading ? <Typography>Loading tasks...</Typography> : null}
								{!loading && tasks.length === 0 ? (
									<Typography>No tasks in this filter yet.</Typography>
								) : null}
								{tasks.map((task) => {
									const isEditing = editingTaskId === task.id;

									return (
										<Paper
											key={task.id}
											elevation={0}
											sx={{
												p: 1.25,
												backgroundColor: "rgba(255,255,255,0.12)",
												color: "white",
											}}
										>
											<Stack spacing={1}>
												<Stack direction="row" spacing={1} alignItems="center">
													<Checkbox
														checked={isEditing ? editingCompleted : task.completed}
														onChange={(event) => {
															if (isEditing) {
																setEditingCompleted(event.target.checked);
																return;
															}

															toggleTaskCompleted(task.id, event.target.checked);
														}}
														disabled={saving}
														sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
													/>
													{isEditing ? (
														<TextField
															fullWidth
															size="small"
															value={editingTitle}
															onChange={(event) => setEditingTitle(event.target.value)}
															disabled={saving}
															sx={{
																"& .MuiInputBase-input": { color: "white" },
																"& .MuiOutlinedInput-notchedOutline": {
																	borderColor: "rgba(255,255,255,0.4)",
																},
															}}
														/>
													) : (
														<Typography
															flex={1}
															sx={{
																textDecoration: task.completed ? "line-through" : "none",
																opacity: task.completed ? 0.75 : 1,
															}}
														>
															{task.title}
														</Typography>
													)}
												</Stack>

												<Stack direction="row" spacing={1} justifyContent="flex-end">
													{isEditing ? (
														<>
															<Button size="small" variant="contained" onClick={saveTaskEdit} disabled={saving}>
																Save
															</Button>
															<Button
																size="small"
																variant="outlined"
																onClick={() => {
																	setEditingTaskId(null);
																	setEditingTitle("");
																	setEditingCompleted(false);
																}}
																disabled={saving}
																sx={{ color: "white", borderColor: "rgba(255,255,255,0.55)" }}
															>
																Cancel
															</Button>
														</>
													) : (
														<>
															<Button
																size="small"
																variant="outlined"
																onClick={() => {
																	setEditingTaskId(task.id);
																	setEditingTitle(task.title);
																	setEditingCompleted(task.completed);
																}}
																disabled={saving}
																sx={{ color: "white", borderColor: "rgba(255,255,255,0.55)" }}
															>
																Edit
															</Button>
															<Button
																size="small"
																variant="outlined"
																color="error"
																onClick={() => deleteTask(task.id)}
																disabled={saving}
																sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}
															>
																Delete
															</Button>
														</>
													)}
												</Stack>
											</Stack>
										</Paper>
									);
								})}
							</Stack>
						</>
					)}
				</Stack>
			</Drawer>
		</Box>
	);
}
